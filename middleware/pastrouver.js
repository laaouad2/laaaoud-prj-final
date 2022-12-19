const RouteNotFoundMiddleware = (req, res) => {
  res.status(404).send({ msg: "route non trouver" });
};





export default RouteNotFoundMiddleware;
