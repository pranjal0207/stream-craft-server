export const getVideoByID = async (req, res) => {
    res.status(200).json({"message" : "Get Video By ID"});
}

export const createNewVideo = async (req, res) => {
    res.status(200).json({"message" : "Create New Video"});
}

export const updateTitleDescription = async (req, res) => {
    res.status(200).json({"message" : "Update Title Description"});
}

export const deleteVideo = async (req, res) => {
    res.status(200).json({"message" : "Delete Video"});
}