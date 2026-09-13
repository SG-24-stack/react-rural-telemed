import Order from "../models/Order.js";
export const createOrder=async(req,res)=>{
    try{
        if(!req.user){
            return res.status(400).json({
                error:"Authentication required"
            });
        }
        const {
            items,
            total_amount,
            delivery_address
        }=req.body;
        if(!items || !Array.isArray(items) || items.length === 0){
            return res.status(400).json({
                error:"Order must contain atleast one medicine"
            });
        }
        if(total_amount === undefined || total_amount<0){
            return res.status(400).json({
                error:"Valid total amount is required"
            });
        }
        for(const item of items){
            if(
                item.medicine_id === undefined ||
                !item.medicine_name ||
                !item.quantity ||
                item.quantity<1 ||
                item.price === undefined ||
                item.price < 0
            ){
                return res.status(400).json({
                    error:"Invalid medicine item in order"
                });
            }
        }
        const order=await Order.create({
            user_id:req.user.id,
            items,
            total_amount,
            delivery_address:delivery_address || "",
            status:"pending"
        });
        return res.status(200).json({
            message:"Order placed successfully",
            order
        });
    }catch(error){
        console.error("Create order error:",error);
        return res.status(500).json({
            error:"Server error while creating order"
        });
    }
}
export const getMyOrders=async(req,res)=>{
    try{
        if(!req.user){
         return res.status(400).json({
            error:"Authentication required"
         });
        }
        const orders=await Order.find({
            user_id:req.user.id
        }).sort({
            createdAt: -1
        });
        return res.status(200).json(orders);
    }catch(error){
        console.error("Get my orders error:",error);
        return res.status(500).json({
            error:"Could not load orders"
        });
    }
};
export const getOrderById=async(req,res)=>{
    try{
      if(!req.user){
        return res.status(400).json({
            error:"Authentication required"
        });
      }
      const {id}=req.params;
      const order=await Order.findOne({
        _id:id,
        user_id:req.user.id
      });
      if(!order){
        return res.status(400).json({
            error:"Order not found"
        });
      }
      return res.status(200).json(order);
    }catch(error){
      console.error("Get order error:",error);
      return res.status(500).json({
        error:"Could not load error"
      });
    }  
};
export const updateOrderStatus=async(req,res)=>{
    try{
     const {id} =req.params;
     const {status}=req.body;
     const allowedStatuses=[
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
     ];
     if(!allowedStatuses.includes(status)){
        return res.status(400).json({
            error:"Invalid order status"
        });
     }
     const order=await Order.findById(id);
     if(!order){
        return res.status(404).json({
            error:"Order not found"
        });
     }
     order.status=status;
     await order.save();
     return res.status(200).json({
        message:"Order status updated successfully",
        order
     });
    }catch(error){
     console.error("Update order status error:",error);
     return res.status(500).json({
        error:"Server error while updating order status"
     });
    }
};
export const cancelOrder=async(req,res)=>{
    try{
    if(!req.user){
        return res.status(400).json({
            error:"Authentication required"
        });
    }
    const {id}=req.params;
    const order=await Order.findOne({
        _id:id,
        user_id:req.user.id
    });
    if(!order){
        return res.status(400).json({
            error:"Order not found"
        });
    }
    if(
        order.status === "shipped" ||
        order.status === "delivered"
    ){
        return res.status(400).json({
            error:"This order cannot be cancelled"
        });
    }
    if(order.status === "cancelled"){
        return res.status(400).json({
            error:"order is already cancelled"
        });
    }
    order.status="cancelled";
    await order.save();
    return res.status(200).json({
        message:"order cancelled successfully",
        order
    });
    }catch(error){
     console.error("Cancel order error:",error);
     return res.status(500).json({
        error:"Server error while cancelling order"
     })
    }
}