import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import pandas as pd
import time
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException

chrome_options = Options()
chrome_options.add_argument("--headless") 
driver = webdriver.Chrome('/Users/sibtain/Projects/sumo-ui-test/BentoUITests/node_modules/webdriver-manager/selenium/chromedriver_2.42', options=chrome_options)

def wait_until_not_exists(selector):
    while True:
        try:
            element = driver.find_element_by_css_selector(selector)
        except NoSuchElementException:
            return

labels = ['strike', 'last', '% from last', 'bid', 'midpoint', 'ask', 'change', '% chg', 'IV', 'volume', 'open int', 'last trade']

def get_barchart_options_activity(symbol, expiration):
    driver.get(f'https://www.barchart.com/etfs-funds/quotes/{symbol}/options?expiration={expiration}-m')
    wait_until_not_exists('div:not(.ng-hide) > img[alt="Please wait..."]')
    tables = driver.find_elements_by_css_selector('table')
    
    def scrape_table(table):
        options = list()
        for tr in table.find_elements_by_css_selector('tr'):
            option = list()
            for td in tr.find_elements_by_css_selector('td'):
                option.append(td.text)
            if len(option) == len(labels) + 1 and option[0] != 'Strike':
                options.append(option[:-1])
                
        return pd.DataFrame(options, columns=labels)
        
    calls = scrape_table(tables[0])
    puts = scrape_table(tables[1])
    
    calls['type'] = 'Call'
    puts['type'] = 'Put'
    df = pd.concat([calls, puts])
    
    return df