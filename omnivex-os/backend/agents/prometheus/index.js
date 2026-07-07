import {
  connectInstagram,
  publishMultiPlatform,
  purchaseWhatsAppNumber
} from "../../growth/zernio.js";

export default function prometheus(bus) {
  return {
    async publish(message) {
      return await publishMultiPlatform(message);
    },

    async connectInstagram() {
      return await connectInstagram();
    },

    async purchaseNumber() {
      return await purchaseWhatsAppNumber();
    },

    onEvent(event) {
      console.log("[PROMETHEUS]", event?.type);
    }
  };
}
