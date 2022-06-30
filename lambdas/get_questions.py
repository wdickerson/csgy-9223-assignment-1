import json
import boto3
import requests
import os

es_url = 'https://search-qoissant-es-tqf2rrobxwudzpeawsa5p4l44i.us-east-1.es.amazonaws.com/posts/_search'
dynamo_client = boto3.client('dynamodb')

def lambda_handler(event, context):
    # Craft an es query based on users input
    query = {
        "size": 3,
        "query": {
            "term": {
                "tags": event['query']
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
            'posts': []
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
    
    # Return the formatted posts
    return {
        'posts': posts
    }
