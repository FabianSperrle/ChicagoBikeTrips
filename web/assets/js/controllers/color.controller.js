function Colors() {
    this.customerColor = "#68b300"
    this.subscriberColor = "yellow";

    this.backgroundMin = "white";
    this.backgroundMax = "#18f";

    this.bg_chroma = chroma.scale([this.backgroundMin, this.backgroundMax]);
    this.cust_sub_chroma = chroma.scale([this.subscriberColor, this.customerColor]);
};

var colors = new Colors();
