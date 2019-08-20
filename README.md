# Apify Scrapy Executor

This actor allows you to run crawlers written in the [scrapy framework](https://scrapy.org) on the Apify platform. Executing a spider is as simple as copy-pasting your scrapy code into the actor's input. For multi-file scrapy spiders, see the bottom of this Readme.

## Input Configuration

The actor has the following input options:

- **Scrapy code** - Paste your scrapy source code into this field.
- **Proxy Configuration** - Optionally, select a proxy to be used by the actor. The actor automatically executes all your scrapy http(s) through the proxy.

## Apify Python Package: Datasets and Key-Value Stores

To store your scrapy items in Apify's dataset and/or key-value store, use the apify python package.

At the top of your, import the python package like so:

```python
import apify
```

To push your scraped data to the Apify dataset, use the pushData() method, like so:

```python
apify.pushData(item)
```

You can interact with the Apify key-value store using the setValue(), getValue(), and deleteValue() methods, like so:

```python
apify.setValue('foo.txt', 'bar')
apify.getValue('foo.txt')
apify.deleteValue('foo.txt')
```

These methods are available for both local and platform actor runs. 

## Uploading Multi-File Scrapy Spiders

If your scrapy spider contains multiple files and/or you want to configure your scrapy settings, pipelines, middlewares, etc., you can very easily clone this actor and import your multi-file scrapy spider. Here are instructions for how to do so:

1. Clone [this actor](https://github.com/vdrmota/actor-scrapy-executor) to your local workspace.
2. Run `npm install`.
3. Copy your spider(s) into the actor/spiders/ directory.
4. Make any changes to items.py, middlewares.py, pipelines.py, and/or settings.py in the actor/ directory.
5. Run `apify run`. That's it!

You can also upload your actor to the Apify platform using `apify push`. Thereafter, you can run and scehdule your scrapy spider(s) on the Apify platform.