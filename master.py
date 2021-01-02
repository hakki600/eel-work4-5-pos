import pandas as pd
from item import Item

class Master:
    def __init__(self):
        filename = "./items.csv"
        self.__register_master(filename)
            
    def register_master(self, filename):
        self.__register_master(filename)
        # print(self.item_master)
        
    # マスタ登録関数
    def __register_master(self, filename):
        ret = -1
        self.item_master=[]
        try:
            df = pd.read_csv(filename, encoding="utf-8", dtype={'item_code':str})
            for row in df.itertuples():
                self.item_master.append(Item(row.item_code, row.item_name, row.price)) 
            ret = 0
        except FileNotFoundError as e:
            print(e)
        return ret
        
        
    
        