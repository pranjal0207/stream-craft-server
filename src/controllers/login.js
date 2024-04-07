export const login = async (req, res) => {
    res.status(200).json({"message" : "login"});
}

export const createNewUser = async (req, res) => {
    res.status(200).json({"message" : "Create New User"});
}
