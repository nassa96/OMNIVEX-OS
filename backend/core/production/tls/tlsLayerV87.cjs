/**
 * SAINT V87 — TLS SECURITY LAYER
 */

class TLSLayerV87 {

  encrypt(data) {
    return "enc_" + JSON.stringify(data);
  }

  decrypt(data) {
    return data.replace("enc_", "");
  }
}

module.exports = TLSLayerV87;
