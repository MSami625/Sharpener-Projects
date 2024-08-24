const Slots = require("../models/slots");
const Meets = require("../models/meets");


exports.getMeets=async (req, res, next) => {
    try {
    
      const meets = await Meets.findAll({
        include: [{
          model: Slots,
          attributes: ['time'], 
          required: true 
        }]
      });
  
    
      const filteredMeets = meets.filter(meet => {
        return meet.slot.time; 
      });
  
      res.json(filteredMeets);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  exports.cancelMeet = (req, res, next) => {
    const id = req.params.id;
    const slotId = req.params.slotId;
    Meets.findByPk(id)
      .then((meet) => {
        return meet.destroy();
      })
      .then((result) => {
        console.log(result);
        Slots.findByPk(slotId).then((slot) => {
          slot.count++;
          return slot.save();
        });
      })
      .catch((err) => {
        console.log(err);
      });
      res.send("Meet cancelled successfully");
  }


