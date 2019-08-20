const Apify = require('apify');
const { spawn } = require('child_process');
const fs = require('fs');
const tar = require('tar');
const tarfs = require('tar-fs');
const execSync = require('child_process').execSync;

Apify.getValue('INPUT').then((input) => {

  if (input != null) {

    // build spider
    fs.writeFileSync('./actor/spiders/run.py', input.scrapyCode, (err) => {
        if (err) console.log(err);
        console.log('Successfully built scrapy spider.');
    });

    // configure proxy
    var useProxy = false;
    var proxyAddress = `http://auto:${process.env.APIFY_PROXY_PASSWORD}@proxy.apify.com:8000`;
    if (!input.proxyConfig.useApifyProxy && input.proxyConfig.proxyUrls != null && input.proxyConfig.proxyUrls.length !== 0) {
      useProxy = true;
      const proxyUrl = input.proxyConfig.proxyUrls[0];
      proxyAddress = proxyUrl;
    } else if (input.proxyConfig.useApifyProxy && input.proxyConfig.apifyProxyGroups != null && input.proxyConfig.apifyProxyGroups.length !== 0) {
      useProxy = true;
      const proxyGroups = input.proxyConfig.apifyProxyGroups.join('+');
      proxyAddress = `http://groups-${proxyGroups}:${process.env.APIFY_PROXY_PASSWORD}@proxy.apify.com:8000`;
    } else if (input.proxyConfig.useApifyProxy) {
      useProxy = true;
      proxyAddress = `http://auto:${process.env.APIFY_PROXY_PASSWORD}@proxy.apify.com:8000`;
    }

  }

  Apify.getValue('jobdir.tgz').then((stream) => {

    // load persistent storage
    if (stream != null) {
        fs.writeFileSync('downloaded.tgz', stream);
        try { execSync('rm -r ./crawls/'); } catch (err) {}
        fs.createReadStream('downloaded.tgz').pipe(tarfs.extract('./'));
    }

    // if apify didn't auto-create
    try { execSync('mkdir ./apify_storage/'); } catch (err) {}
    try { execSync('mkdir ./apify_storage/datasets && mkdir ./apify_storage/datasets/default'); } catch (err) {}
    try { execSync('mkdir ./apify_storage/key_value_stores && mkdir ./apify_storage/key_value_stores/default'); } catch (err) {}

    // construct scrapy env vars
    const env = Object.create(process.env);
    if (useProxy) {
      env.http_proxy = proxyAddress;
    }

    // update spider state every 5 seconds
    const storeJobsInterval = setInterval(() => {
        tar.c({ gzip: false, file: 'jobdir.tgz' }, ['crawls/']).then(() => {
          Apify.setValue('jobdir.tgz', fs.readFileSync('jobdir.tgz'), { contentType: 'application/tar+gzip' });
        });
      }, 5000);

    // run spiders  
    const scrapyList = spawn('scrapy', ['list']);
    const scrapyRun = spawn('xargs', ['-n', '1', 'scrapy', 'crawl'], { env });
    scrapyList.stdout.on('data', (data) => {
      scrapyRun.stdin.write(data);
    });
    scrapyList.stderr.on('data', (data) => {
      console.log(`${data}`);
    });
    scrapyList.on('close', (code) => {
      if (code !== 0) {
        console.log(`scrapy list exited with code ${code}`);
      }
      scrapyRun.stdin.end();
    });
    scrapyRun.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    scrapyRun.stderr.on('data', (data) => {
      console.log(`${data}`);
    });
    scrapyRun.on('close', (code) => {
        clearInterval(storeJobsInterval);
      if (code !== 0) {
        console.log(`scrapy crawl process exited with code ${code}`);
      }
    });
  });
});
