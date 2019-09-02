# Scrapy Executor

This actor allows you to run web spiders written in Python
and the [Scrapy framework](https://scrapy.org) on the [Apify](https://apify.com/) platform.
Executing a spider is as simple as copy-pasting your Scrapy code into the actor's input.
For multi-file Scrapy spiders, see the bottom of this readme.

Please note that the actor is experimental and it might change in the future.

## Input configuration

The actor has the following input options:

- **Scrapy code** - Paste your Python source code with Scrapy into this field.
- **Proxy** - Optionally, select a proxy to be used by the actor,
  in order to avoid IP address-based blocking by the target website.
  The actor automatically executes all the Scrapy's HTTP(S) requests through the proxy.

## Storing data on Apify cloud

To store your Scrapy items in Apify's [Dataset](https://apify.com/docs/storage#dataset)
or [Key-value store](https://apify.com/docs/storage#key-value-store) cloud storages,
you can use the [`apify`](https://pypi.org/project/apify/) Python package.
All the methods are available for actors running both locally as well as on the Apify platform. 

First, import the package by adding the following command to the top of your source file:

```python
import apify
```

To push your scraped data to the Dataset associated with the actor run, use the `pushData()` method:

```python
apify.pushData(item)
```

Note that Datasets are useful for storing large tabular results, such as a list of products from an e-commerce site.

To interact with the default Key-value store associated with the actor run,
use the `setValue()`, `getValue()`, and `deleteValue()` methods:

```python
apify.setValue('foo.txt', 'bar')
apify.getValue('foo.txt')
apify.deleteValue('foo.txt')
```

Key-value stores are useful for storing files, e.g. screenshots, PDFs of crawler state.


## Multi-file Scrapy spiders

If your Scrapy spider contains multiple source code or configuration files,
or you want to configure Scrapy settings, pipelines or middlewares,
you can download the source code of this actor, import your files into it
and push it to the Apify cloud for execution.

Before you start, make sure you have Python development environment set up, and [NPM](https://www.npmjs.com/package/npm)
and [Apify CLI](https://apify.com/docs/cli) installed on your computer.

Here are instructions:

1. Clone the [GitHub repository](https://github.com/apifytech/actor-scrapy-executor) with the source code of this actor:
   ```
   git clone https://github.com/apifytech/actor-scrapy-executor
   ```
2. Go to the repository directory and install NPM packages:
   ```
   cd actor-scrapy-executor
   npm install
   ```
3. Copy your spider(s) into the `actor/spiders/` directory.
4. Make any necessary changes to files in the the `actor/` directory, including `items.py`, `middlewares.py`, `pipelines.py` or `settings.py`.
5. Run the actor locally on your computer and test that it works:
   ```
   apify run
   ```
6. If everything works fine, upload the actor to the Apify platform, so that you can run it in the cloud:
   ```
   apify push
   ```

And that's it!

If you have any problem or anything does not work,
please file an [issue on GitHub](https://github.com/apifytech/actor-scrapy-executor/issues).
