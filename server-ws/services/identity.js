exports.getIdentity = req => {
    /* validate identity here... */

    return req.headers.identity
}
