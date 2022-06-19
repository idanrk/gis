import time
from selenium import webdriver
from selenium.webdriver.common.by import By
import json
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

browser = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
browser.get('https://www.gov.il/apps/police/stations_publish/')
time.sleep(1)
lines = browser.find_element(By.XPATH, "/html/body/div[3]/app-root/article/app-stations/div[2]/div[2]/ul")
lines = lines.find_elements(By.TAG_NAME, "li")
data = []
for line in lines:
    line.find_element(By.TAG_NAME, "img").click()
    time.sleep(0.4)
    try:
        imgs = line.find_element(By.CLASS_NAME, "stationContent")
        imgs = imgs.find_element(By.TAG_NAME, "img")
    except Exception:
        time.sleep(0.3)
        try:
            imgs = line.find_element(By.CLASS_NAME, "stationContent")
            imgs = imgs.find_element(By.TAG_NAME, "img")
        except Exception:
            continue
    res = {}
    res["img"] = imgs.get_attribute("src")
    res["nitzav"] = line.find_element(By.CLASS_NAME, "mefakedName").text.strip("\n"),
    res["city"] = line.find_element(By.CLASS_NAME, "col-md-4").text.strip("\n"),
    more = line.find_elements(By.CLASS_NAME, "DataField")
    res["address"] = more[0].text.strip("\n")
    res["phone"] = more[1].text.strip("\n")
    res["fax"] = more[2].text.strip("\n")
    data.append(res)
    time.sleep(0.4)
browser.get('https://www.dotcom.co.il/tools/googlegeocoder/')
time.sleep(1)
textbox = browser.find_element(By.XPATH, '//*[@id="addressForm"]/input[1]')
click = browser.find_element(By.XPATH, '//*[@id="addressForm"]/input[2]')
lat = browser.find_element(By.XPATH, '//*[@id="lat"]')
long = browser.find_element(By.XPATH, '//*[@id="long"]')
browser.execute_script("arguments[0].removeAttribute('disabled')", lat)
browser.execute_script("arguments[0].removeAttribute('disabled')", long)
for station in data:
    textbox.click()
    textbox.clear()
    textbox.send_keys(station["city"][0] + " " + station["address"])
    click.click()
    time.sleep(1.5)
    station["lat"] = lat.get_attribute('value')
    station["long"] = long.get_attribute('value')
geocode = {
    "type": "FeatureCollection",
    "features": []
}
for station in data:
    instance = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                station["long"],
                station["lat"]
            ]
        },
        "properties": {
            "city": station["city"][0],
            "address": station["address"],
            "chief": station["nitzav"][0],
            "phone": station["phone"],
            "fax": station["fax"],
            "image": station["img"],
        }
    }
    geocode["features"].append(instance)
with open('./src/assets/data/data.geojson', 'w', encoding="utf8") as f:
    json.dump(geocode, f, ensure_ascii=False, indent=4)
