const Slots = require("../models/slots");
const Meets = require("../models/meets");



exports.getSlots= async(req, res, next) => {
    const slots=await Slots.findAll();
     res.json(slots);
   }


exports.bookMeet = async (req, res, next) => {
    const { slotId, name, email, time } = req.body;
  
    try {
      // Find the slot by primary key
      const slot = await Slots.findByPk(slotId);
      
      if (!slot) {
        return res.status(404).send("Slot not found");
      }
  

      if (slot.count === 0) {
        return res.send("Slot is already booked (No slots available)");
      }else{
    
      await slot.createMeet({
        userName: name,
        userEmail: email,
        time: time,
      });
      slot.count--;
      await slot.save();
      }
     
      res.send("Meet booked successfully");
  
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
