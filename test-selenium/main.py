from selenium import webdriver
import time
import os

TESTS_DIR = 'paginas'


def get_class(kls):
    parts = kls.split('.')
    module = ".".join(parts[:-1])
    m = __import__(module)
    for comp in parts[1:]:
        m = getattr(m, comp)
    return m


if __name__ == "__main__":
    driver = webdriver.Firefox()

    for filename in os.listdir(TESTS_DIR):

        # No mires las carpetas
        if not os.path.isfile(os.path.join(TESTS_DIR, filename)):
            continue

        # La classe abstracta no hace falta tocarla
        if(filename == 'abs_test.py'):
            continue

        # Crea un objeto a partir del nombre de la classe
        class_name = filename.split('.')[0]
        class_name = class_name[0].upper() + class_name[1:]
        module_name = '.'.join([TESTS_DIR, filename.split('.')[0], class_name])
        class_obj = get_class(module_name)
        test_class = class_obj(driver)

        # Empieza a correr el test
        print('[STARTING TEST]::{}'.format(class_name))
        if test_class.run():
            print('[TEST SUCCESSFUL]::{}'.format(class_name))
        else:
            print('[FAILED TEST]::{}'.format(class_name))
        test_class.clean_up()

    driver.close()
