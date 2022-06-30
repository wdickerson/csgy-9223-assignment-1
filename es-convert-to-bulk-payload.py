import csv
import json

csvfile = open('ES.tsv', 'r')
jsonfile = open('es-bulk-payload.json', 'w')

fieldnames = ("id","tags")
reader = csv.DictReader( csvfile, fieldnames, delimiter=';')
for row in reader:
    my_tags = row["tags"]
    json.dump({"index": {"_index": "posts",  "_id": row["id"]}}, jsonfile)
    jsonfile.write('\n')
    jsonfile.write(f'{{ "tags": {my_tags} }}')
    jsonfile.write('\n')
