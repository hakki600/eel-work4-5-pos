import pandas as pd

### オーダークラス
class Order:
    def __init__(self,item_master):
        self.item_order_list=[] # stringのlist
        self.item_master=item_master # Itemクラスのlist
        self.total = 0
        self.df = pd.DataFrame(columns=['code',
                                        'name',
                                        'amount',
                                        'subtotal'])
  
    def add_item_order(self, item_code, item_amount):
        name = ""
        price = 0
        for i in range(int(item_amount)):
             # C# linq -> list.where(x=>x.item_code=order).select(x=>x.item_name)
            name = [x.item_name for x in self.item_master if x.item_code==item_code]
            price = [x.price for x in self.item_master if x.item_code==item_code]
            if not name:
                return -1, name, price
            # 購買履歴のある商品
            if ((self.df['code']==item_code).any()):
                self.df.amount[self.df.code==item_code] += 1
                self.df.subtotal[self.df.code==item_code] += price
            # 購買履歴のない商品
            else:
                self.df = self.df.append(pd.DataFrame(
                    {'code': item_code,
                     'name': name,
                     'amount': 1,
                     'subtotal': price}
                ))
        # print(self.df)   
        return 0, name, price
        
    def get_total(self):
        self.total = self.df.subtotal.sum()
        return self.total
    
    def get_df(self):
        return self.df