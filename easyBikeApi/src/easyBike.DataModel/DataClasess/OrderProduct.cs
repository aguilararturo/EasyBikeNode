﻿namespace easyBike.DataModel.DataClasess
{
    public class OrderProduct
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Total { get; set; }
        public Product Product { get; set; }
        public User User { get; set; }
    }
}