import { db } from './config'

export const getNotes = () => {
  let items= []
  const notes = db.ref('notes/').once('value').then((snapshot) => {
      snapshot.forEach((child) => {
        items.push({
          id: child.key,
          description: child.val().description,
          picture: child.val().picture,
          time: child.val().time,
          totalComments: child.val().totalComments,
          totalLike: child.val().totalLike,
          userId: child.val().userId,
        });
      });
      return items;
  });
  return notes;
}

export const getNote = async (id) => {
  const notes = await db.ref(`notes/${id}`).once('value').then((snapshot) => {
      return snapshot;
  });
  return notes;
}

