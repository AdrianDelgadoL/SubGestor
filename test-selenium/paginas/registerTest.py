from paginas.abs_test import TestBase, BASE_URL
from selenium.common.exceptions import WebDriverException, NoSuchElementException
from time import sleep

class RegisterTest(TestBase):

    def __init__(self, driver):
        super().__init__(driver)

    def pre_run(self):
        super().pre_run()
        try:
            self.driver.get(BASE_URL)
            sleep(1)
            btn_register_section = self.driver.find_element_by_xpath('/html/body/div/nav/div/ul/li[2]/a')
            btn_register_section.click()
            sleep(1)
        except WebDriverException:
            print('[ERR]::Page unreachable')
            return False
        return True

    def run(self):
        if not super().run(): return False

        try:
            input_email = self.driver.find_element_by_xpath('/html/body/div/div/div/form/div[1]/input')
            input_pass  = self.driver.find_element_by_xpath('/html/body/div/div/div/form/div[2]/input')
            input_pass2 = self.driver.find_element_by_xpath('/html/body/div/div/div/form/div[3]/input')
            btn_submit = self.driver.find_element_by_xpath('/html/body/div/div/div/form/div[4]/button')

            print('[TEST] :: Errores en campos solos')
            print('\tEmail')
            to_test = ['aixo no es un email', 'aixo@tampoc']
            for email in to_test:
                res = TestBase.check_for_input_error(
                    self.driver,
                    input_email,
                    email,
                    '/html/body/div/div/div/form/div[1]/span',
                    'dirección de email incorrecta'
                )
                if not res : return False

            print('\tPassword')
            to_test = ['curt', 'largonomajuscula', 'Majuscula', 'Acurt']
            for paswd in to_test:
                res = TestBase.check_for_input_error(
                    self.driver,
                    input_pass,
                    paswd,
                    '/html/body/div/div/div/form/div[2]/span',
                    'la contraseña tiene que contener una mayúscula y 8 o más carácteres'
                )
                if not res: return False

            print('[TEST] :: Errores Backend')
            print('\tCampos vacios')

            # Todos los campos vacios
            input_email.clear()
            input_pass.clear()
            input_pass2.clear()
            sleep(0.1)
            btn_submit.click()
            err = self.driver.find_element_by_xpath('/html/body/div/div/div/form/span')
            if err.text != 'El formulario contiene errores':
                print('No sale mensaje de error correcto')
                return False

            # Solo un campo lleno -- email
            input_email.send_keys('hola@hola.com')
            btn_submit.click()
            err = self.driver.find_element_by_xpath('/html/body/div/div/div/form/span')
            if err.text != 'El formulario contiene errores':
                print('No sale mensaje de error correcto')
                return False

            # Solo un campo lleno -- pass
            input_email.clear()
            input_pass.send_keys('Correcto')
            btn_submit.click()
            err = self.driver.find_element_by_xpath('/html/body/div/div/div/form/span')
            if err.text != 'El formulario contiene errores':
                print('No sale mensaje de error correcto')
                return False

            # Solo un campo lleno -- pass2
            input_email.clear()
            input_pass.clear()
            input_pass2.send_keys('Correcto')
            btn_submit.click()
            err = self.driver.find_element_by_xpath('/html/body/div/div/div/form/span')
            if err.text != 'El formulario contiene errores':
                print('No sale mensaje de error correcto')
                return False

            print('\tContraseñas no coinciden')
            input_pass2.clear()
            input_email.send_keys('abcd@abcd.com')
            input_pass.send_keys('Correcto2')
            input_pass2.send_keys('Correcto')
            btn_submit.click()
            err = self.driver.find_element_by_xpath('/html/body/div/div/div/form/span')
            if err.text != 'Las contraseñas no coinciden':
                print('No sale mensaje de error correcto')
                return False

            print('\tCuenta ya existente')
            input_pass2.clear()
            input_email.send_keys('hola@hola.com')
            input_pass.send_keys('Correcto')
            input_pass2.send_keys('Correcto')
            btn_submit.click()
            err = self.driver.find_element_by_xpath('/html/body/div/div/div/form/span')
            if err.text != 'Este usuario ya existe':
                print('No sale mensaje de error correcto')
                return False

            return True


        except NoSuchElementException as e:
            print('[ERR] :: Didn\'t find html element')
            print(str(e))
            return False

    def clean_up(self):
        super().clean_up()
