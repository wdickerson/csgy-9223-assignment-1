import json
import boto3
import requests
import uuid
import os

es_url = 'https://search-qoissant-es-tqf2rrobxwudzpeawsa5p4l44i.us-east-1.es.amazonaws.com/posts/_search'
dynamo_client = boto3.client('dynamodb')
lex_client = boto3.client('lexv2-runtime')
sns_client = boto3.client('sns')

def lambda_handler(event, context):
    # Get tags from the query string
    tags = [event['query']]

    # If text is provided, use Lex to extract tags from it
    if event['text']:
        lex_response = lex_client.recognize_text(
            botId='WMGBFYKKSZ',
            botAliasId='ICNN7N6BNB',
            localeId='en_US',
            sessionId=str(uuid.uuid4()),
            text=event['text'],
        )
        
        interpretations = lex_response['interpretations']
        
        interpretation = next(
            intent for intent in interpretations 
            if intent['intent']['name'] == 'SearchForTag'
        )
        
        intent = interpretation['intent']
        
        tags = [
            value['value']['interpretedValue']
            for value in intent['slots']['tag']['values']
        ]
    
    
    # Craft an es query based on the tags
    query = {
        "size": 3,
        "query": {
            "bool": {
                "should": [
                    { "match": { "tags": tag } }
                    for tag in tags
                ],
                "minimum_should_match" : 1,
            }
        }
    }

    headers = { 
        "Content-Type": "application/json",
        "Authorization": "Basic " + os.environ['ES_KEY'],
    }

    # Make the HTTP request to es
    r = requests.post(es_url, headers=headers, data=json.dumps(query))

    # Return now if no hits from es
    if r.json()['hits']['total']['value'] == 0:
        return {
            'posts': [],
            'searched_tags': tags,
        }
    
    # Craft a dynamodb batch query based on the es result
    es_ids = [
        hit['_id']
        for hit in r.json()['hits']['hits']
    ]
    
    batch_keys = {
        'posts': {
            'Keys': [
                { 'id': { 'S': es_id } } 
                for es_id in es_ids
            ]
        },
    }
    
    # Get the posts from dynamo and format them
    response = dynamo_client.batch_get_item(RequestItems=batch_keys)

    posts = [{
        'id': returned_post['id']['S'],
        'text': returned_post['posts']['S']
    } for returned_post in response['Responses']['posts']]
    
    # Publish to SNS to send an email
    sns_client.publish(
        TopicArn='arn:aws:sns:us-east-1:506866252805:qoissant',
        Message='\n\n'.join([post['text'] for post in posts]),
        Subject='Qoissant results for: ' + ', '.join(tags),
    )
    
    # Return the formatted posts
    return {
        'posts': posts,
        'searched_tags': tags,
    }
