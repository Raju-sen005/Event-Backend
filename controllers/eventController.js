import Event from "../models/event.js";

/* =========================
   CREATE EVENT (Vendor)
========================= */
export const createEvent = async (req, res) => {
  try {
    const vendorId = req.vendorId;
    const {
      name,
      customerName,
      date,
      location,
      category,
      amount,
    } = req.body;

    if (!name || !date || !location || !category) {
      return res.status(400).json({
        message: "name, date, location and category are required",
      });
    }

    const event = await Event.create({
      vendorId,
      name,
      customerName,
      date,
      location,
      category,
      amount,
      status: "Planning",
      progress: 0,
      nextAction: "Initial planning",
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET MY EVENTS (Vendor)
========================= */
export const getMyEvents = async (req, res) => {
  try {
    const vendorId = req.vendorId;

    const events = await Event.findAll({
      where: { vendorId },
      order: [["date", "ASC"]],
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET SINGLE EVENT
========================= */
export const getEventById = async (req, res) => {
  try {
    const vendorId = req.vendorId;
    const eventId = req.params.id;

    const event = await Event.findOne({
      where: { id: eventId, vendorId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE EVENT (Vendor)
========================= */
export const updateEvent = async (req, res) => {
  try {
    const vendorId = req.vendorId;
    const eventId = req.params.id;

    const event = await Event.findOne({
      where: { id: eventId, vendorId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const {
      name,
      date,
      location,
      category,
      status,
      progress,
      nextAction,
      amount,
    } = req.body;

    await event.update({
      name,
      date,
      location,
      category,
      status,
      progress,
      nextAction,
      amount,
    });

    res.json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE EVENT (Vendor)
========================= */
export const deleteEvent = async (req, res) => {
  try {
    const vendorId = req.vendorId;
    const eventId = req.params.id;

    const event = await Event.findOne({
      where: { id: eventId, vendorId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.destroy();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ALL EVENTS (Admin)
========================= */
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      total: events.length,
      events,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ACTIVE EVENTS
========================= */
export const getActiveEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: {
        status: ["Active", "In Progress", "Planning"],
      },
      order: [["date", "ASC"]],
    });

    res.status(200).json({
      success: true,
      total: events.length,
      events,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
