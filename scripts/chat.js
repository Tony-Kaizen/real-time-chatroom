// add new chat documents
// set up a real-time listener to get new chats
// update the username
// update the chatroom

//this class handles the chatroom data
class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.chats = db.collection('chats');
    this.unsub;
  }
  async addChat(message) {
    //format a chat object
    const now = new Date();
    const chat = {
      message,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(now)
    };
    //save the chat document
    const response = await this.chats.add(chat);
    return response;
  }
  getChats(callback) {
    this.unsub = this.chats
      //complex query, only get documents which match the current chatroom
      .where('room', '==', this.room)
      //order documents by time created
      .orderBy('created_at')
      //real-time listener
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            //update the UI
            callback(change.doc.data());
          }
        });
      });
  }
  updateName(username) {
    this.username = username;
    localStorage.setItem('username', username);
  }
  updateRoom(room) {
    this.room = room;
    if (this.unsub) {
      this.unsub();
    }
  }
}