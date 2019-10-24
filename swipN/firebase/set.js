import {db} from './config'

export const setLike = (keyNotes, id) => {
  db.ref(`notes/${keyNotes}`).once('value').then((snapshot) => {
    let likes = snapshot.val().totalLike
    // like if first user like
    if(likes === undefined) {
      likes = [id]
      update(likes, keyNotes)
    }
    // unlike
    else if(likes.includes(id)){
      let removeId = likes.filter( oneId => oneId !== id)
      likes = removeId
      update(likes, keyNotes)
    }
    // like
    else{
      likes.push(id)
      update(likes, keyNotes)
    }

  });
}

function update(likes, keyNotes) {
  db.ref(`/notes/${keyNotes}`).update({
    totalLike: likes,
  });
}



