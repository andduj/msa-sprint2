class BookingListRequest {
  constructor() {
    this.userId = null;
  }

  setUserId(userId) {
    this.userId = userId;
    return this;
  }

  getUserId() {
    return this.userId;
  }
}

export { BookingListRequest };
