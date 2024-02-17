class PeerService {
  peer = null;
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
            ],
          },
        ],
      });
    }
  }
  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      return offer;
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(ans);
      return ans;
    }
  }

  async setRemoteDescriptionWithAnswer(ans) {
    if (this.peer) await this.peer.setRemoteDescription(ans);
  }

  // async setIceCandidate(candidate) {
  //   await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
  // }
}

export default new PeerService();
