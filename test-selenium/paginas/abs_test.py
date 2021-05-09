import sys
from abc import ABC, abstractmethod
from time import sleep
from selenium.common.exceptions import NoSuchElementException

BASE_URL = 'http://localhost:3000/'

class TestBase(ABC):

    def __init__(self, driver):
        super().__init__()
        self.driver = driver

    @abstractmethod
    def pre_run(self):
        pass

    @abstractmethod
    def clean_up(self):
        pass

    @abstractmethod
    def run(self):
        try:
            self.driver.current_url
        except:
            print('[ERR]:: Closed driver', file=sys.stderr)
            return False
        if not self.pre_run():
            return False
        return True

    @staticmethod
    def check_error_raiseup(d, input_e, input_text, error_class_name):
        print('>>>Provant: ' + input_text)
        input_e.send_keys(input_text)
        sleep(0.5)
        n_errs = len(d.find_elements_by_class_name(error_class_name))
        input_e.clear()
        if n_errs <= 0: print('[ERR] :: No se creo ningun mensage de error para el input:"{}"'.format(input_text))
        return n_errs > 0

    @staticmethod
    def check_for_input_error(d, input_e, input_text, xpath_error, err_msg):

        print('>>>Provant: ' + input_text)
        input_e.send_keys(input_text)
        sleep(0.5)
        try:
            err = d.find_element_by_xpath(xpath_error)
            if err.text != err_msg:
                print(
                    '[ERR] :: No sale mensaje de error correcto! Tendria que salir "{}" y no "{}"'\
                        .format(err_msg,err.text)
                )
                return False
        except NoSuchElementException as e:
            print(
                '[ERR] :: No se encuentra el mensaje de error "{}" para el input "{}"'\
                .format(err_msg,input_text)
            )
            print(str(e))
            return False
        input_e.clear()
        return True

    @staticmethod
    def check_for_valid_input(d,input_e, input_text, error_class_name):
        print('Probando input valido: '+input_text)
        input_e.send_keys(input_text)
        sleep(0.5)
        res = (len(d.find_elements_by_class_name(error_class_name)) == 0)
        if not res: print('[ERR] :: Salio un error para el input:"{}"'.format(input_text))
        input_e.clear()
        return res

    