from paginas.abs_test import TestBase, BASE_URL
from selenium.common.exceptions import WebDriverException, NoSuchElementException
from time import sleep

class FaqTest(TestBase):

    def __init__(self, driver):
        super().__init__(driver)
        self.faq = '/html/body/div/nav/div/ul/li[3]/a'
        self.questions_class = 'tab'
        self.answers_class = 'showContent'
        self.e_questions = None

    def pre_run(self):
        super().pre_run()
        try:
            # Ves a la seccion de la FAQ
            self.driver.get(BASE_URL)
            sleep(1)
            btn_faq_section = self.driver.find_element_by_xpath(
                self.faq
            )
            btn_faq_section.click()
            sleep(1)

            # Troba les preguntes
            self.e_questions = self.driver.find_elements_by_class_name(
                self.questions_class
            )

        except WebDriverException:
            print('[ERR]::Page unreachable')
            return False
        return True

    def clean_up(self):
        super().clean_up()

    def run(self):
        super().run()

        #  ABRILLLLLLLLLLLLLLLL
        print('[TEST] :: Abrir todas las pregunas una por una')
        for i,question in enumerate(self.e_questions):
            # Clica en pregunta
            question.click()
            # Cuenta nuero respuestas
            n_ans = len(self.driver.find_elements_by_class_name(
                self.answers_class
            ))
            if n_ans != (i+1) : return False

        # CERRALLLLLLLLLL
        print('[TEST] :: Cerrar todas las pregunas una por una')
        q_len = len(self.e_questions)
        for i,question in enumerate(self.e_questions):
            # Clica en pregunta
            question.click()
            # Cuenta nuero respuestas
            n_ans = len(self.driver.find_elements_by_class_name(
                self.answers_class
            ))
            if n_ans != (q_len - (i+1)) : return False

        return True


