from selenium import webdriver
from selenium.webdriver.common.proxy import Proxy
from selenium.webdriver.common.proxy import ProxyType

def  main():
    options = webdriver.ChromeOptions()
    #options.headless = True
    options.proxy = Proxy({'proxyType': ProxyType.MANUAL, 'httpProxy': 'http://127.0.0.1:8081'})
    # 系统代理会覆盖py配置的代理
    options.ignore_local_proxy_environment_variables()
    driver = webdriver.Chrome(options=options)
    driver.get("https://huster.cn/Test")
    driver.quit()

if __name__ == '__main__':
    main()