from paginas.abs_test import TestBase, BASE_URL
from selenium.common.exceptions import WebDriverException, NoSuchElementException
from time import sleep

class LoginTest(TestBase):

    def __init__(self, driver):
        super().__init__(driver)
        self.login_section = '/html/body/div/nav/div/ul/li[1]/a'
        self.email = '/html/body/div/div/div/form/div[1]/input'
        self.password = '/html/body/div/div/div/form/div[2]/input'
        self.submit = '/html/body/div/div/div/form/div[3]/button'
        self.logout = '/html/body/div/nav/div/ul/li[2]/a'
        self.e_email = None
        self.e_password = None
        self.e_submit = None

    def pre_run(self):
        super().pre_run()
        try:
            # Ves a la seccion de login
            self.driver.get(BASE_URL)
            sleep(1)
            btn_login_section = self.driver.find_element_by_xpath(
                self.login_section
            )
            btn_login_section.click()
            sleep(1)

            # Carga los elementos, listos para modificarlos
            self.e_email = self.driver.find_element_by_xpath(
                self.email
            )
            self.e_password = self.driver.find_element_by_xpath(
                self.password
            )
            self.e_submit = self.driver.find_element_by_xpath(
                self.submit
            )
        except WebDriverException:
            print('[ERR]::Page unreachable')
            return False
        return True

    def clean_up(self):
        sleep(0.5)
        super().clean_up()
        try:
            # Sal de la cuenta si estas logeado
            btn_logout = self.driver.find_element_by_xpath(
                self.logout
            )
            btn_logout.click()
        except:
            pass

        sleep(0.5)

    def run(self):
        if not super().run() : return False

        print('[TEST] :: Errores en campos')
        print('>>>EMAIL: invalidos')
        to_test = [ 'invalid', '@novalid.com', 'tampocvalid@.com' ]
        for email in to_test:
            res = TestBase.check_error_raiseup(
                self.driver,
                self.e_email,
                email,
                'signUp-errorMessage'
            )
            if not res: return False
        print('>>>EMAIL: valido')
        if not TestBase.check_for_valid_input(
            self.driver,
            self.e_email,
            'bon@email.com',
            'signUp-errorMessage'
        ) : return False

        print('>>>PASSWD: invalidos')
        # Pon email valido para evitar interferencias con los mensajes de error
        self.e_email.send_keys('valid@valid.com')
        sleep(0.5)
        to_test = [ 'invd', 'novalidasd', 'AAAAAAAAAAAA' ]
        for passwd in to_test:
            res = TestBase.check_error_raiseup(
                self.driver,
                self.e_password,
                passwd,
                'signUp-errorMessage'
            )
            if not res: return False
        print('>>>PASSWD: valido')
        
        if not TestBase.check_for_valid_input(
            self.driver,
            self.e_password,
            'abcD1234',
            'signUp-errorMessage'
        ) : return False

        self.e_email.clear() # Saca el correo valido

        print('[TEST] :: Errores backend')
        print('>>>Usuario no existe')
        url = self.driver.current_url
        self.e_email.send_keys('noexiste@noexiste.com')
        self.e_password.send_keys('Abcd1234')
        self.e_submit.click()
        sleep(1)
        if self.driver.current_url != url:
            print('[ERR] :: Ha logeado cuando no debia')
            return False

        print('[TEST] :: Login valido')
        url = self.driver.current_url
        self.e_email.send_keys('paratest@test.com')
        self.e_password.send_keys('Test1234')
        self.e_submit.click()
        sleep(1)
        if self.driver.current_url == url:
            print('[ERR] :: No ha loggeado con cuenta buena')
            return False

        return True


