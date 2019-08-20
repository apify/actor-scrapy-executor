import os
import time
import json
import requests

def pushData(payload):
    if os.environ.get("APIFY_IS_AT_HOME") is '1':
        datasetId = os.environ.get('APIFY_DEFAULT_DATASET_ID')
        authToken = os.environ.get('APIFY_TOKEN')
        url = 'https://api.apify.com/v2/datasets/%s/items?token=%s' % (datasetId, authToken)
        data = {"body": payload}
        headers = {'Content-Type': 'application/json'}
        return requests.post(url, json=data, headers=headers).content
    else:
        datasetDir = './%s/datasets/default/' % os.environ.get('APIFY_LOCAL_STORAGE_DIR')
        fileName = '%s.json' % str(int(time.time() * 1000 * 1000))
        with open(datasetDir + fileName, 'w') as f:
            f.write(json.dumps(payload))
        return 0
        
def setValue(key, value, options = {}):
    if os.environ.get("APIFY_IS_AT_HOME") is '1':
        storeId = os.environ.get('APIFY_DEFAULT_KEY_VALUE_STORE_ID')
        authToken = os.environ.get('APIFY_TOKEN')
        url = 'https://api.apify.com/v2/key-value-stores/%s/records/%s?token=%s' % (storeId, key, authToken)
        data = value
        if "contentType" in options:
            headers = {'Content-Type': options["contentType"]}
        else:
            headers = {'Content-Type': 'application/json'}
        return requests.put(url, json=data, headers=headers).content
    else:
        storeDir = './%s/key_value_stores/default/' % os.environ.get('APIFY_LOCAL_STORAGE_DIR')
        fileName = '%s.txt' % key
        with open(storeDir + fileName, 'w') as f:
            f.write(json.dumps(value))
        return 0

def getValue(key):
    if os.environ.get("APIFY_IS_AT_HOME") is '1':
        storeId = os.environ.get('APIFY_DEFAULT_KEY_VALUE_STORE_ID')
        authToken = os.environ.get('APIFY_TOKEN')
        url = 'https://api.apify.com/v2/key-value-stores/%s/records/%s?token=%s' % (storeId, key, authToken)
        return requests.get(url).content
    else:
        storeDir = './%s/key_value_stores/default/' % os.environ.get('APIFY_LOCAL_STORAGE_DIR')
        fileName = '%s.txt' % key
        return open(storeDir + fileName, 'r').read()

def deleteValue(key):
    if os.environ.get("APIFY_IS_AT_HOME") is '1':
        storeId = os.environ.get('APIFY_DEFAULT_KEY_VALUE_STORE_ID')
        authToken = os.environ.get('APIFY_TOKEN')
        url = 'https://api.apify.com/v2/key-value-stores/%s/records/%s?disableRedirect=true&token=%s' % (storeId, key, authToken)
        return requests.delete(url)
    else:
        storeDir = './%s/key_value_stores/default/' % os.environ.get('APIFY_LOCAL_STORAGE_DIR')
        fileName = '%s.txt' % key
        return os.remove(storeDir + fileName)