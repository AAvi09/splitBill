import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const App = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriend, setNewFriend] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const handleAddFriend = () => {
    setShowAddFriend((showAddFriend) => !showAddFriend);
  };
  const handleNewFriend = (newFriend) => {
    setNewFriend((friend) => [...friend, newFriend]);
    setShowAddFriend((showAddFriend) => !showAddFriend);
  };
  const handleSelectedFriend = (friend) => {
    console.log("selected firend : ", friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  };
  const handleSplitBill = (value) => {
    setNewFriend((newFriend) =>
      newFriend.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  };
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          newFriend={newFriend}
          selectedFriend={selectedFriend}
          handleSelectedFriend={handleSelectedFriend}
        />
        {showAddFriend && <FormAddFriend handleNewFriend={handleNewFriend} />}
        <Button onClick={() => handleAddFriend()}>
          {showAddFriend ? "Close " : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
};

const FriendList = ({ newFriend, handleSelectedFriend, selectedFriend }) => {
  const friends = newFriend;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          selectedFriend={selectedFriend}
          handleSelectedFriend={handleSelectedFriend}
        />
      ))}
    </ul>
  );
};

const Friend = ({ friend, handleSelectedFriend, selectedFriend }) => {
  const { id, image, balance } = friend;
  const isOpen = selectedFriend?.id === friend.id;
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${friend.balance}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <Button onClick={() => handleSelectedFriend(friend)}>
        {isOpen ? "close" : "Select"}
      </Button>
    </li>
  );
};

const Button = ({ children, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};

const FormAddFriend = ({ handleNewFriend }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const addFriend = { id, name, image: `${image}?=${id}`, balance: 0 };
    console.log(addFriend);
    handleNewFriend(addFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  };
  return (
    <form className="form-add-friend" onSubmit={handleFormSubmit}>
      <label>🍟friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌆 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
};

const FormSplitBill = ({ selectedFriend, handleSplitBill }) => {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    handleSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  };
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a Bill with {selectedFriend.name}</h2>
      <label>💸Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>👦💸Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>💵💴{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>💲💳who's paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>SPLIT BILL</Button>
    </form>
  );
};

export default App;
