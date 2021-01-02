import eel
import desktop
import numpy as np
import pandas as pd
from master import Master
from order import Order

@eel.expose
def refresh_pos():
    # global明示しないとlocalになる
    global master, order 
    master = Master()  
    order = Order(master.item_master)
    # print(order.df)
    return master, order
    
@eel.expose
def item_register(code, amount):
    return order.add_item_order(code, amount)

@eel.expose
def get_total():
    return order.get_total() 

@eel.expose
def master_register(filename):
    return master.register_master(filename)  

def main():
    master, order = refresh_pos()
    start_dir="web"
    end_point="index.html"
    size=(600,670)
    desktop.start(start_dir, end_point, size)

if __name__ == "__main__":
    main()
