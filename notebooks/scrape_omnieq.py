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

def wait_until_exists(selector):
    max_num_tries = 10000000
    num_tries = 0
    while max_num_tries > num_tries:
        num_tries += 1
        try:
            element = driver.find_element_by_css_selector(selector)
        except NoSuchElementException:
            continue
        return True
    
    return False

us_bd = CustomBusinessDay(calendar=USFederalHolidayCalendar())
def get_all_dates_in_range(day1, day2):
    dates = pd.date_range(start=day1, end=day2, freq=us_bd)
    all_dates_in_range = []
    for index in dates.to_frame().iterrows():
        all_dates_in_range.append(index[0])
    return all_dates_in_range
    
column_headers = ['Time', 'Open', 'High', 'Low', 'Close', 'Volume', 'VWAP']
def get_historical_options_activity(symbol, strike, expiration, day):
    day_str = day.strftime('%Y/%m/%d')
    option_chain_str = f'{symbol.upper()}{expiration.strftime("%d%b")}20C{strike}.00/historical/{day_str}'
    print('scraping: ', f'https://omnieq.com/underlyings/ARCA/{symbol.upper()}/chain/{option_chain_str}')
    driver.get(f'https://omnieq.com/underlyings/ARCA/{symbol.upper()}/chain/{option_chain_str}')
    try:
        not_found = driver.find_element_by_css_selector('main.lost')
    except NoSuchElementException:
        not_found = False
        
    if not_found:
        print('page not found')
        return None
    
    wait_until_exists('#data table')
    table = driver.find_element_by_css_selector('#data table')
        
    options = list()
    for tr in table.find_elements_by_css_selector('tbody tr'):
        option = list()
        for idx, td in enumerate(tr.find_elements_by_css_selector('td')):
            value = float(td.text.replace('$', '').replace(',', '')) if idx > 0 else datetime.fromtimestamp(int(td.text))
            option.append(value)
        options.append(option)
        
    df = pd.DataFrame(options, columns=column_headers)
    
    return df

def get_omnieq_file_name(symbol, strike, exp):
    file_name_formatted_exp = exp.strftime('%m-%d-%Y')
    return f'{symbol}_{str(strike)}_{file_name_formatted_exp}.csv'

def scrape_and_save_omnieq(symbol, strike, exp, start, end):
    file_name = get_omnieq_file_name(symbol, strike, exp)
    print(f'Scraping {file_name}')
    try:
        prev_data = pd.read_csv(file_name).set_index('Time')
    except:
        prev_data = pd.DataFrame([], columns=column_headers).set_index('Time')
        
    for date in get_all_dates_in_range(start, end):
        print('Starting: ', date.strftime('%m-%d-%Y'))
        df = get_historical_options_activity(symbol, strike, exp, date).set_index('Time')
        prev_data = pd.concat([prev_data, df])
        prev_data.to_csv(file_name)
        print('Saved: ', str(date), 'to', file_name)

scrape_and_save_omnieq('spy', 315, datetime(2020, 7, 17), '2020-06-22', '2020-07-10')