import boto3
import uuid
from datetime import datetime

dynamo_client = boto3.client('dynamodb')

def lambda_handler(event, context):
    new_post = event['post']
    new_id = str(uuid.uuid4())
    new_date = datetime.utcnow().isoformat()
    
    dynamo_client.put_item(
        TableName='posts', 
        Item={
            'id': { 'S': new_id },
            'date': { 'S': new_date },
            'posts': { 'S': new_post },
        }
    )
    
    return {
        'id': new_id,
        'post': new_post,
    }
