import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Switch,
  StyleSheet,
  TextInput,
} from 'react-native';

const API_KEY = 'AEGMgTkB1WGdjDvMK950GDNMpQAUQLHZ';
const API_URL = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${API_KEY}`;

const App = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState({});
  const [isDiscountEnabled, setIsDiscountEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const formattedBooks = data.results.books.map(book => ({
        id: book.primary_isbn13,
        title: book.title,
        author: book.author,
        price: (Math.random() * (30 - 15) + 15).toFixed(2),
        image: book.book_image,
      }));
      setBooks(formattedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const addToCart = (book) => {
    setCart(prevCart => ({
      ...prevCart,
      [book.id]: (prevCart[book.id] || 0) + 1
    }));
  };

  const removeFromCart = (bookId) => {
    setCart(prevCart => {
      const updatedCart = { ...prevCart };
      if (updatedCart[bookId] > 1) {
        updatedCart[bookId]--;
      } else {
        delete updatedCart[bookId];
      }
      return updatedCart;
    });
  };

  const getTotal = () => {
    const total = Object.entries(cart).reduce((sum, [bookId, quantity]) => {
      const book = books.find(b => b.id === bookId);
      return sum + (parseFloat(book.price) * quantity);
    }, 0);
    return isDiscountEnabled ? total * 0.9 : total;
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => removeFromCart(item.id)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{cart[item.id] || 0}</Text>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NYT Çok Satan Kitaplar</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Kitap veya yazar ara..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={item => item.id}
      />
      <View style={styles.cartContainer}>
        <View style={styles.discountContainer}>
          <Text>%10 İndirim</Text>
          <Switch
            value={isDiscountEnabled}
            onValueChange={setIsDiscountEnabled}
          />
        </View>
        <Text style={styles.totalText}>
          Toplam: ${getTotal().toFixed(2)}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  bookItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bookImage: {
    width: 100,
    height: 150,
    resizeMode: 'cover',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 4,
    width: 30,
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  cartContainer: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  discountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;