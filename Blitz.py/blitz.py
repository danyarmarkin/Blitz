import winsound
import sys
import random
import os
import time
from PyQt4 import QtCore, QtGui, uic
from math import sqrt

random.seed()


app = QtGui.QApplication(sys.argv)
form_class, base_class = uic.loadUiType('blitz.ui')

dur = 0

TIMES = 3
times = TIMES

QUESTIONS = [11, 12, 13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,11**2,12**2,13**2,14**2,15**2,16**2,17**2,18**2,19**2, 21**2,22**2,23**2,24**2,25**2,26**2,27**2,28**2,29**2,31**2,32**2,33**2,34**2,35**2,36**2]
questions = QUESTIONS.copy()

answers = []


class DemoImpl(QtGui.QDialog, form_class):
    def __init__(self, *args):
        global nullTime
        global times
        global TIMES
        super(DemoImpl, self).__init__(*args)

        self.setupUi(self)
        self.lcdNumber.display('00:00:00')
        nullTime=self.timeEdit.time().addSecs(3)
        self.timeEdit.setTime(nullTime)
        self.setWindowFlags(QtCore.Qt.Window|QtCore.Qt.WindowCloseButtonHint|QtCore.Qt.WindowMaximizeButtonHint|QtCore.Qt.WindowMinimizeButtonHint)
        times = self.spinBoxNumerOfQuestions.value()
        TIMES = times
        self.textEdit.setAlignment(QtCore.Qt.AlignCenter)

    @QtCore.pyqtSlot()
    def closeEvent(self, event):
        global timer
        timer.stop()

    @QtCore.pyqtSlot('int')
    def on_spinBox_valueChanged(self, value):
        self.textEdit.setFont(QtGui.QFont('Times New Roman', value))

    @QtCore.pyqtSlot('int')
    def on_spinBoxNumerOfQuestions_valueChanged(self, value):
        global TIMES
        global times
        times = self.spinBoxNumerOfQuestions.value()
        TIMES = times
        
    def showTime(self):
            global dur
            global timer
            global duration
            global times
            global questions
            global answers
            duration = duration.addSecs(-1)
            timeString = duration.toString()    
            if dur < 1 and times == 0:
                print(dur, times)
                timer.stop()
                dur = 0
                self.pushButton.setText('Пуск')
                timer.killTimer(timerid)
                self.textEdit.setFont(QtGui.QFont('Times New Roman', 40))
                #self.textEdit.setText(str(answers)[1:-1])
                #answers = []
                #questions = QUESTIONS.copy()
                #times = TIMES
                self.textEdit.setText('Нажмите "Ответы" для проверки')
                self.pushButtonAns.setEnabled(True)
                
            elif dur < 1 and times > 0:
                q = random.choice(questions)
                questions.remove(q)
                if q > 100:
                    answers.append(int(sqrt(q)))
                    questions.remove(int(sqrt(q)))
                else:
                    answers.append(q**2)                    
                    questions.remove(q**2)
                self.textEdit.setText(str(q))
                self.textEdit.setAlignment(QtCore.Qt.AlignCenter)
                self.textEdit.setFont(QtGui.QFont('Times New Roman', self.spinBox.value()))
                times -= 1
                duration = self.timeEdit.time()
                timeString = duration.toString()
                self.lcdNumber.display(timeString)
                secs=duration.second()
                mins=duration.minute()
                hours=duration.hour()
                dur= secs + 60*mins + 3600*hours+1
                winsound.PlaySound("sound.wav", winsound.SND_ASYNC)
                self.pushButtonAns.setEnabled(False)
            elif dur > 0:
                self.lcdNumber.display(timeString)
                self.pushButtonAns.setEnabled(False)
            dur = dur - 1
        
    @QtCore.pyqtSlot()
    def on_pushButtonStop_clicked(self):
        global nullTime
        global timer
        global times
        timer.stop()
        self.lcdNumber.display('00:00:00')
        self.timeEdit.setTime(nullTime)
        self.pushButton.setText('Пуск')
        self.timeEdit.setEnabled(True)
        self.pushButtonAns.setEnabled(False)
        self.textEdit.setText('')
        times = TIMES

    @QtCore.pyqtSlot()
    def on_pushButtonAns_clicked(self):
        self.textEdit.setText(str(answers)[1:-1])
        self.textEdit.setFont(QtGui.QFont('Times New Roman', 70))

    @QtCore.pyqtSlot()
    def on_pushButton_clicked(self):
        global dur
        global timer, timerid
        global duration
        global answers
        global questions
        global times
        global TIMES
        timer = QtCore.QTimer()
        timerid=timer.timerId()
        if self.timeEdit.time() != QtCore.QTime(0,0,0):
            if self.pushButton.text()=='Пуск':
                answers = []
                questions = QUESTIONS.copy()
                times = TIMES
                self.textEdit.setText('Внимание...')
                self.textEdit.setAlignment(QtCore.Qt.AlignCenter)
                self.textEdit.setFont(QtGui.QFont('Times New Roman', 70))
                self.pushButtonAns.setEnabled(False)
                
                winsound.PlaySound("sound.wav", winsound.SND_ASYNC)
                self.timeEdit.setEnabled(False)
                duration = self.timeEdit.time()
                timeString = duration.toString()
                self.lcdNumber.display(timeString)
                secs=duration.second()
                mins=duration.minute()
                hours=duration.hour()
                dur= secs + 60*mins + 3600*hours
                timer.timeout.connect(self.showTime)
                timer.start(1000)                
                self.pushButton.setText('Пауза')

            elif self.pushButton.text()=='Пауза':
                self.pushButtonAns.setEnabled(True)
                print('Нажата Пауза')
                timer.killTimer(timerid)
                self.pushButton.setText('Продолжить')

            elif self.pushButton.text()=='Продолжить':
                secs=duration.second()
                mins=duration.minute()
                hours=duration.hour()
                dur = secs+60*mins+3600*hours
                timer.timeout.connect(self.showTime)
                timer.start(1000)
                self.pushButton.setText('Пауза')
                
            
        

form = DemoImpl()
form.show()
sys.exit(app.exec_())
