import scrapy
import apify
 
class MySpider(scrapy.Spider):
 	name = 'apifySpider'
 
 	def start_requests(self):
 		urls = [
 			'https://apify.com',
 			'https://apify.com/store',
 		]
 		for url in urls:
 			yield scrapy.Request(url=url, callback=self.parse)
 
 	def parse(self, response):
 		url = response.url
 		title = response.css('title::text').get()
 		output = {
 			'url': url,
 			'title': title
 		}
 		apify.pushData(output)