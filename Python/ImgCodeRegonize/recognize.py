# 代码用到了https://github.com/sml2h3/ddddocr
import os
import random
import string
import ddddocr
import requests

# 识别验证码
class ImgCodeRegonize:

    def __init__(self):
        self.ocr = ddddocr.DdddOcr()

    def downloadImg(self, url, header, prefix):
        res = requests.get(url=url, headers=header,verify=False)
        filename = ''.join(random.sample(string.ascii_letters + string.digits, 4))
        filename += '.' + prefix
        with open(filename, 'wb') as f:
            f.write(res.content)
        f.close()
        return filename


    # 识别图片验证码
    def recognize(self, file, ocr):
        image = open(file, "rb").read()
        result = self.ocr.classification(image)
        os.remove(file)
        return result


    def ImgText(self, url, headers ,prefix):
        file = self.downloadImg(url=url, header=headers, prefix=prefix)
        result = self.recognize(file, self.ocr)
        return result