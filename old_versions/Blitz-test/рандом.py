import winsound
import sys
import subprocess
import random
import os
from PyQt4 import uic
from PyQt4 import QtGui
from PyQt4 import QtCore

textmarker = "++был(а) у доски++     "

random.seed()


app = QtGui.QApplication(sys.argv)
form_class, base_class = uic.loadUiType('demo.ui')

dialf_class, dialb_class = uic.loadUiType('createClass.ui')
dialchf_class, dialchb_class = uic.loadUiType('chooseClass.ui')
dialErrorF_class, dialErrorB_class = uic.loadUiType('errorMessage.ui')
dialEditClassF_class, dialEditClassB_class = uic.loadUiType('editClass.ui')
dialStartFromTheBeginingF_class, dialEditClassB_class = uic.loadUiType('startFromTheBegining.ui')

currentclassname=''


class ErrorMessage(QtGui.QDialog, dialErrorF_class):
    def __init__(self, *args):
        super(ErrorMessage, self).__init__(*args)
        self.setupUi(self)

    def editLabelText(self, labelText):
        self.label_2.setText(labelText)

class EditClass(QtGui.QDialog, dialEditClassF_class):
    def __init__(self, *args):
        super(EditClass, self).__init__(*args)
        self.setupUi(self)
        f = open('buffstring.txt', 'r')
        string = f.read()
        f.close()
        if string == '':
            pass
        else:
            self.plainTextEdit.setPlainText(string)
        f = open(currentclassname + '//spisok.txt', 'r')
        classListString = f.read()
        f.close()
        self.plainTextEdit.setPlainText(classListString)
        self.lineEdit.setText(currentclassname)
        global oldClassName
        oldClassName = currentclassname

    @staticmethod
    def eClass(parent = None):
        global currentclassname
        dialog = EditClass(parent)
        result = dialog.exec_()
        classList = dialog.plainTextEdit.toPlainText()
        className = dialog.lineEdit.text()

        currentclassname = className
        return (oldClassName, classList, className, result == 1)

class CreateClass(QtGui.QDialog, dialf_class):
    def __init__(self, *args):
        super(CreateClass, self).__init__(*args)
        self.setupUi(self)
        f = open('buffstring.txt', 'r')
        string = f.read()
        f.close()
        
        if string == '':
            pass
        else:
            self.plainTextEdit.setPlainText(string)

    def classList(self):
        return self.plainTextEdit.toPlainText()

    def className(self):
        return self.lineEdit.text()

    @staticmethod
    def getClassList(parent = None):
        dialog = CreateClass(parent)
        result = dialog.exec_()
        list = dialog.classList()
        name = dialog.className()
        return (list, name, result == 1)

class StartFromTheBegining(QtGui.QDialog, dialStartFromTheBeginingF_class):
    def __init__(self, *args):
        super(StartFromTheBegining, self).__init__(*args)
        self.setupUi(self)

    @staticmethod
    def startOrNot(parent = None):
        dialog = StartFromTheBegining(parent)
        result = dialog.exec_()
        return (result)


class ChooseClass(QtGui.QDialog, dialchf_class):
    def __init__(self, *args):
        super(ChooseClass, self).__init__(*args)
        self.setupUi(self)
        


    @staticmethod
    def getCurrentClass(parent = None):
        dialog = ChooseClass(parent)
        result = dialog.exec_()
        list = dialog.currentClass()
        currentclassname=list
        return (list, result == 1)

class DemoImpl(QtGui.QDialog, form_class):
    def __init__(self, *args):
        super(DemoImpl, self).__init__(*args)

        self.setupUi(self)
        self.connect(self.textButton, QtCore.SIGNAL('clicked()'), self.createNewCLass)
        self.setWindowFlags(QtCore.Qt.Window|QtCore.Qt.WindowCloseButtonHint|QtCore.Qt.WindowMaximizeButtonHint|QtCore.Qt.WindowMinimizeButtonHint)

        dirs = os.listdir(os.getcwd())
        lendirs = len(dirs)
        for i in range(lendirs):
            if  os.path.isdir(dirs[lendirs-i-1]):
                pass
            else:
                dirs.pop(lendirs-i-1)
        self.comboBox.addItems(dirs)
        self.ClassList.setContextMenuPolicy(QtCore.Qt.CustomContextMenu)
        self.ClassList.connect(self.ClassList,QtCore.SIGNAL("customContextMenuRequested(QPoint)" ), self.listItemRightClicked)

    
    @QtCore.pyqtSlot('int')
    def on_spinBox_valueChanged(self, value):
        self.MainFrame.setFont(QtGui.QFont('Times New Roman', value))

    @QtCore.pyqtSlot('int')
    def on_chooseAllCheckBox_stateChanged(self, state):
        if state == 2:
            for i in range(0, self.ClassList.count()):
                self.ClassList.item(i).setCheckState(QtCore.Qt.Checked)
        elif state == 0:
            for i in range(0, self.ClassList.count()):
                self.ClassList.item(i).setCheckState(QtCore.Qt.Unchecked)

    @QtCore.pyqtSlot('QString')
    def on_comboBox_currentIndexChanged(self, item):
        global currentclassname
        currentclassname=item
        self.chooseCurrentCLass()

    def currentClass(self):
        return self.comboBox.currentText()


    def chooseCurrentCLass(self):
        currentClassName, result = self.currentClass(), True
# формирование массива со списком класса
        if currentClassName != '' and result == True:
            f=open(currentclassname+"//pupilsPresenceList.txt", "r")
            a=f.read()
            f.close()
            pupilsPresenceList = a.split("\n")

            f=open(currentclassname+"//pupilsBringedList.txt", "r")
            a=f.read()
            f.close()
            pupilsAddBringlist = a.split("\n")
            
            self.EditClassButton.setEnabled(True)
            self.chooseAllCheckBox.setEnabled(True)
            self.BringToTheBoardButton.setEnabled(True)
            
            f=open(currentClassName+"/spisok.txt", "r")
            a=f.read()
            f.close()
            pupilsList = a.split("\n")
            while True:
                if pupilsList[len(pupilsList)-1]=='':
                    pupilsList.pop(len(pupilsList)-1)
                else:
                    break    

# очищение списка класса
            while self.ClassList.count() != 0:
                self.ClassList.takeItem(0)
# загрузка списка класса
            for i in range(0, len(pupilsList)):
                if pupilsAddBringlist[i] == "already":
                    self.ClassList.addItem(textmarker+pupilsList[i])
                else:
                    self.ClassList.addItem(pupilsList[i])
                self.ClassList.item(i).setFlags(QtCore.Qt.ItemIsUserCheckable | QtCore.Qt.ItemIsEnabled)
                self.ClassList.item(i).setCheckState(QtCore.Qt.Checked)
            self.changeClassNameLabel(currentClassName)
        return currentClassName

    def changeClassNameLabel(self, name):
        self.classNameLabel.setText(name)

    def createNewCLass(self):
        global currentclassname
        while True:
            classListString, className, result = CreateClass.getClassList()
            if result == False:
                f = open('buffstring.txt', 'w')
                f.write('')
                f.close()
                break
            else:
                f = open('buffstring.txt', 'w')
                f.write(classListString)
                f.close()
                try:
                    os.makedirs(className)
                except OSError:
                    if className == '':
                        errorText = 'Введите название класса'
                    else:
                        errorText = 'Название класса не может содержать символы: \\ / : * \" ? < > |'

                    className = ''
                    error_dialog = ErrorMessage()
                    error_dialog.editLabelText(errorText)
                    error_dialog.exec_()

                classListList = classListString.split('\n')
                a=''
                b=''
                for i in range(len(classListList)):
                    a=a+'0\n'
                    b=b+'waiting\n'

                if className == '':
                    pass
                else:
                    self.EditClassButton.setEnabled(True)
                    self.chooseAllCheckBox.setEnabled(True)
                    self.BringToTheBoardButton.setEnabled(True)
                    f = open(className + '//pupilsBringedList.txt', 'w')
                    f.write(b)
                    f.close()
                    f = open(className + '//pupilsPresenceList.txt', 'w')
                    f.write(b)
                    f.close()
                    f = open(className + '//spisok.txt', 'w')
                    f.write(classListString)
                    f.close()
                    f = open(className + '//stat.txt', 'w')
                    f.write(a)
                    f.close()
                    f = open('buffstring.txt', 'w')
                    f.write('')
                    f.close()
                    currentclassname=className
                    self.changeClassNameLabel(className+':')
                    while self.ClassList.count() != 0:
                        self.ClassList.takeItem(0)
                    for i in range(0, len(classListList)):
                        self.ClassList.addItem(classListList[i])
                        self.ClassList.item(i).setFlags(QtCore.Qt.ItemIsUserCheckable | QtCore.Qt.ItemIsEnabled)
                        self.ClassList.item(i).setCheckState(QtCore.Qt.Checked)
                    break

    @QtCore.pyqtSlot('QListWidgetItem*')
    def on_ClassList_itemDoubleClicked(self, item):
        winsound.PlaySound("1sound.wav", winsound.SND_ASYNC)
        while self.MainFrame.count() != 0:
            self.MainFrame.takeItem(0)
        self.MainFrame.addItem(item.text().replace(textmarker,""))

        f=open(currentclassname+'//pupilsBringedList.txt', "r")
        a=f.read()
        f.close()
        pupilsBringedList = a.split("\n")
        while True:
            if pupilsBringedList[len(pupilsBringedList)-1]=='':
                pupilsBringedList.pop(len(pupilsBringedList)-1)
            else:
                break

        
        k = self.ClassList.currentRow()
        pupilsBringedList[k] = "already"

        f=open(currentclassname+'//pupilsBringedList.txt', 'w')
        for p in pupilsBringedList:
            f.write("%s\n" % p)
        f.close()
        
        item.setText(textmarker+item.text().replace(textmarker,""))
        
        

    @QtCore.pyqtSlot('QListWidgetItem*')
    def on_ClassList_itemChanged(self, item):
        if item.checkState()==2:
            f=open(currentclassname+"//pupilsPresenceList.txt", "r")
            a=f.read()
            f.close()
            pupilsPresenceList = a.split("\n")
            while True:
                if pupilsPresenceList[len(pupilsPresenceList)-1]=='':
                    pupilsPresenceList.pop(len(pupilsPresenceList)-1)
                else:
                    break
            pupilsPresenceList[self.ClassList.row(item)]='waiting'
            f=open(currentclassname+'//pupilsPresenceList.txt', 'w')
            for p in pupilsPresenceList:
                f.write("%s\n" % p)
            f.close()
        elif item.checkState()==0:
            f=open(currentclassname+'//pupilsPresenceList.txt', 'r')
            a=f.read()
            f.close()
            pupilsPresenceList = a.split("\n")
            while True:
                if pupilsPresenceList[len(pupilsPresenceList)-1]=='':
                    pupilsPresenceList.pop(len(pupilsPresenceList)-1)
                else:
                    break
            pupilsPresenceList[self.ClassList.row(item)]='none'
            f=open(currentclassname+'//pupilsPresenceList.txt', 'w')
            for p in pupilsPresenceList:
                f.write("%s\n" % p)
            f.close()

    @QtCore.pyqtSlot()
    def on_EditClassButton_clicked(self):
        global currentclassname
        while True:
            oldClassName, classListString, className, result = EditClass.eClass()
            if result == False:
                f = open('buffstring.txt', 'w')
                f.write('')
                f.close()
                break
            else:
                f = open('buffstring.txt', 'w')
                f.write(classListString)
                f.close()
                try:
                    os.rename(oldClassName,className)
                except OSError:
                    if className == '':
                        errorText = 'Введите название класса'
                    else:
                        errorText = 'Отказано в доступе (невозможно переименовать папку)'

                    className = ''
                    currentclassname=oldClassName
                    error_dialog = ErrorMessage()
                    error_dialog.editLabelText(errorText)
                    error_dialog.exec_()

                classListList = classListString.split('\n')
                while True:
                    if classListList[len(classListList)-1]=='':
                        classListList.pop(len(classListList)-1)
                    else:
                        break
                    
                a=''
                b=''
                for i in range(len(classListList)):
                    a=a+'0\n'
                    b=b+'waiting\n'

                if className == '':
                    pass
                else:
                    f = open(className + '//pupilsPresenceList.txt', 'w')
                    f.write(b)
                    f.close()
                    f = open(className + '//pupilsBringedList.txt', 'w')
                    f.write(b)
                    f.close()
                    f = open(className + '//spisok.txt', 'w')
                    f.write(classListString)
                    f.close()
                    f = open(className + '//stat.txt', 'w')
                    f.write(a)
                    f.close()
                    f = open('buffstring.txt', 'w')
                    f.write('')
                    f.close()
                    currentclassname=className
                    self.changeClassNameLabel(className+':')
                    while self.ClassList.count() != 0:
                        self.ClassList.takeItem(0)
                    for i in range(0, len(classListList)):
                        self.ClassList.addItem(classListList[i])
                        self.ClassList.item(i).setFlags(QtCore.Qt.ItemIsUserCheckable | QtCore.Qt.ItemIsEnabled)
                        self.ClassList.item(i).setCheckState(QtCore.Qt.Checked)
                    break
     
    @QtCore.pyqtSlot()
    def on_StartFromTheBegining_clicked(self):
        f=open(currentclassname+'//spisok.txt', "r")
        a=f.read()
        f.close()
        pupilsList = a.split("\n")
        while True:
            if pupilsList[len(pupilsList)-1]=='':
                pupilsList.pop(len(pupilsList)-1)
            else:
                break

        f=open(currentclassname+'//pupilsBringedList.txt', "r")
        a=f.read()
        f.close()
        pupilsBringedList = a.split("\n")
        while True:
            if pupilsBringedList[len(pupilsBringedList)-1]=='':
                pupilsBringedList.pop(len(pupilsBringedList)-1)
            else:
                break
            
        for i in range(len(pupilsBringedList)):
            pupilsBringedList[i]="waiting"
            self.ClassList.item(i).setText(pupilsList[i])

        f=open(currentclassname+'//pupilsBringedList.txt', 'w')
        for p in pupilsBringedList:
            f.write("%s\n" % p)
        f.close()
            
 


    @QtCore.pyqtSlot()
    def on_BringToTheBoardButton_clicked(self):

        f=open(currentclassname+'//spisok.txt', "r")
        a=f.read()
        f.close()
        pupilsList = a.split("\n")
        while True:
            if pupilsList[len(pupilsList)-1]=='':
                pupilsList.pop(len(pupilsList)-1)
            else:
                break

        f=open(currentclassname+'//pupilsPresenceList.txt', "r")
        a=f.read()
        f.close()
        pupilsPresenceList = a.split("\n")
        while True:
            if pupilsPresenceList[len(pupilsPresenceList)-1]=='':
                pupilsPresenceList.pop(len(pupilsPresenceList)-1)
            else:
                break

        f=open(currentclassname+'//pupilsBringedList.txt', "r")
        a=f.read()
        f.close()
        pupilsBringedList = a.split("\n")
        while True:
            if pupilsBringedList[len(pupilsBringedList)-1]=='':
                pupilsBringedList.pop(len(pupilsBringedList)-1)
            else:
                break
            
        i=random.randint(0,len(pupilsPresenceList)-1)
        t=0
        while True:
            print(t)
            t=t+1
            if t>70:
                doOrNot = StartFromTheBegining.startOrNot()
                if (doOrNot == 1):
                    for p in range(0,len(pupilsBringedList)):
                        pupilsBringedList[p]='waiting'
                    f=open(currentclassname+'//pupilsBringedList.txt', 'w')
                    i=0
                    for p in pupilsBringedList:
                        f.write("%s\n" % p)
                        self.ClassList.item(i).setText(pupilsList[i])
                        i=i+1
                    f.close()
                break
#            if self.ravnomernoCheckBox.checkState()==2:
#                print('check')
#            elif self.ravnomernoCheckBox.checkState()==0:
#                print('uncheck')
            if pupilsBringedList[i] == "already" or pupilsPresenceList[i] == "none":
                i = random.randint(0,len(pupilsBringedList)-1)
            else:
                break

        if t<70:
            pupilsBringedList[i]="already"
            f=open(currentclassname+'//pupilsBringedList.txt', 'w')
            for p in pupilsBringedList:
                f.write("%s\n" % p)
            f.close()
            if pupilsBringedList[i] == "already":
                self.ClassList.item(i).setText(textmarker+pupilsList[i])
            

        if t<70:
            while self.MainFrame.count() != 0:
                self.MainFrame.takeItem(0)
            self.MainFrame.addItem(pupilsList[i])
            self.MainFrame.scrollToBottom()
        else:
            while self.MainFrame.count() != 0:
                self.MainFrame.takeItem(0)
            self.MainFrame.addItem('')
        #os.system('sound.wav')
        #p = subprocess.Popen(['sound.wav'], shell=True, stdout=subprocess.PIPE)
        #subprocess.Popen('sound.wav', shell=True)
        winsound.PlaySound("1sound.wav", winsound.SND_ASYNC)

    
    def listItemRightClicked(self, QPos): 
        self.listMenu= QtGui.QMenu()
        menu_item1 = self.listMenu.addAction("Был у доски")
        menu_item2 = self.listMenu.addAction("Не был у доски")
        self.connect(menu_item1, QtCore.SIGNAL("triggered()"), self.menuItemClicked1)
        self.connect(menu_item2, QtCore.SIGNAL("triggered()"), self.menuItemClicked2)
        parentPosition = self.ClassList.mapToGlobal(QtCore.QPoint(0, 0))        
        self.listMenu.move(parentPosition + QPos)
        self.listMenu.show() 

    def menuItemClicked1(self):
        f=open(currentclassname+'//pupilsBringedList.txt', "r")
        a=f.read()
        f.close()
        pupilsBringedList = a.split("\n")
        while True:
            if pupilsBringedList[len(pupilsBringedList)-1]=='':
                pupilsBringedList.pop(len(pupilsBringedList)-1)
            else:
                break
        
        currentItemRow=self.ClassList.currentRow()
        pupilsBringedList[currentItemRow] = 'already'

        f=open(currentclassname+'//pupilsBringedList.txt', 'w')
        for p in pupilsBringedList:
            f.write("%s\n" % p)
        f.close()

        f=open(currentclassname+'//spisok.txt', "r")
        a=f.read()
        f.close()
        pupilsList = a.split("\n")

        self.ClassList.item(currentItemRow).setText(textmarker+pupilsList[currentItemRow])
    
        
    def menuItemClicked2(self):
        f=open(currentclassname+'//pupilsBringedList.txt', "r")
        a=f.read()
        f.close()
        pupilsBringedList = a.split("\n")
        while True:
            if pupilsBringedList[len(pupilsBringedList)-1]=='':
                pupilsBringedList.pop(len(pupilsBringedList)-1)
            else:
                break
        
        currentItemRow=self.ClassList.currentRow()
        pupilsBringedList[currentItemRow] = 'waiting'

        f=open(currentclassname+'//pupilsBringedList.txt', 'w')
        for p in pupilsBringedList:
            f.write("%s\n" % p)
        f.close()

        f=open(currentclassname+'//spisok.txt', "r")
        a=f.read()
        f.close()
        pupilsList = a.split("\n")
        self.ClassList.item(currentItemRow).setText(pupilsList[currentItemRow])

    @QtCore.pyqtSlot()
    def on_pushButtonFirstGroup_clicked(self):
        f=open(currentclassname+'//pupilsPresenceList.txt', "r")
        a=f.read()
        f.close()
        pupilsPresenceList = a.split("\n")
        while True:
            if pupilsPresenceList[len(pupilsPresenceList)-1]=='':
                pupilsPresenceList.pop(len(pupilsPresenceList)-1)
            else:
                break

        i=0
        while (i<16):
           self.ClassList.item(i).setCheckState(2)
           i = i+1
        i=16
        while (i<len(pupilsPresenceList)):
           self.ClassList.item(i).setCheckState(0)
           i = i+1

    @QtCore.pyqtSlot()
    def on_pushButtonSecondGroup_clicked(self):
        f=open(currentclassname+'//pupilsPresenceList.txt', "r")
        a=f.read()
        f.close()
        pupilsPresenceList = a.split("\n")
        while True:
            if pupilsPresenceList[len(pupilsPresenceList)-1]=='':
                pupilsPresenceList.pop(len(pupilsPresenceList)-1)
            else:
                break
        i=0
        while (i<16):
           self.ClassList.item(i).setCheckState(0)
           i = i+1

        i=16
        while (i<len(pupilsPresenceList)):
           self.ClassList.item(i).setCheckState(2)
           i = i+1

        
                    
form = DemoImpl()
form.show()
sys.exit(app.exec_())
