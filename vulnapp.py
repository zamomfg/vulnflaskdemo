from flask import Flask, render_template, render_template_string, request, redirect
import json
import random
from os.path import exists
from os import getcwd
#import flask_admin # version 1.5.2

vulnapp = Flask(__name__)

google_api_key = "AIzaSyCWFRAyvDEHpJhRf7hlu6PgfL2XxFxmJnQ"
google_custom_search_engine_id = "83914324b45674e3b"

@vulnapp.route("/", methods=['GET'])
def index():
    args = request.args
    animal = args.get("animal")

    if animal == None:
        animal = "get"
        rand_int = random.randint(1,4)
        image_url = f"/static/getimages/get{rand_int}.png"
    else:
        processed_animal_text = animal.lower()
        image_url = get_cute_animal_pic(processed_animal_text)

    redirect_link = "/redirect?redirecturl="+ image_url
    return render_template("index.html", animal_image=image_url, img_ref=redirect_link)

@vulnapp.route("/redirect", methods=['GET', 'POST'])
def redirect_site():
    args = request.args
    url_arg = args.get("redirecturl")
    return render_template("redirect.html", redirect_url=url_arg)
    # print("redirect to", url_arg)
    # return redirect(url_arg, code=302)

@vulnapp.route("/getget", methods=['GET'])
def getget_api():
    image = request.args.get('image')
    img_path = "/static/getimages/" + image
    file_exists = exists(getcwd()+img_path)

    if file_exists:
        template = f'''
        <!DOCTYPE html>
        <html>
        <img src="{img_path}" />
        </html>'''
    else:
        template = '''
        <!DOCTYPE html>
        <html>
            <head>
            <title>getget API</title>
            </head>
            <body>
            <p> Get image ''' + image + ''' don't exist</p>
            </body>
        </html>'''

    return render_template_string(template)

def get_cute_animal_pic(animal):
    pic_data = search_cute_animal_image(animal)
    random_int = random.randint(0,len(pic_data)-1)
    link = pic_data[random_int]["link"]
    print("link", link)
    return link

def search_cute_animal_image(search_text):
    cute_search = "cute " + search_text
    # url = f"https://www.googleapis.com/customsearch/v1?key={google_api_key}&q={cute_search}&searchType=image&cx={google_custom_search_engine_id}"
    # response = requests.get(url)
    # return json.load(response)["items"]
    with open("test_json.json", "r") as f:
        jsondata = f.read()
    return json.loads(jsondata)["items"]




def main():
    vulnapp.run(debug=True)

if __name__ == "__main__":
    main()