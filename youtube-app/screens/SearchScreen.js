import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import VideoCard from '../components/VideoCard';
import { searchVideos } from '../data/mockVideos';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const results = searchVideos(query);
      setSearchResults(results);
      setHasSearched(true);
      Keyboard.dismiss();
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    Keyboard.dismiss();
  };

  const handleVideoPress = (video) => {
    navigation.navigate('VideoPlayer', { video });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#606060" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search YouTube"
          placeholderTextColor="#909090"
          value={searchQuery}
          onChangeText={handleSearch}
          onSubmitEditing={() => handleSearch(searchQuery)}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <MaterialIcons name="close" size={24} color="#606060" />
          </TouchableOpacity>
        )}
      </View>
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="search" size={64} color="#C0C0C0" />
      <Text style={styles.emptyTitle}>
        {hasSearched ? 'No results found' : 'Search for videos'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {hasSearched
          ? 'Try different keywords'
          : 'Enter keywords to search for videos'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <VideoCard video={item} onPress={() => handleVideoPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          searchResults.length === 0 ? styles.emptyListContent : styles.listContent
        }
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingTop: StatusBar.currentHeight + 12 || 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  cancelButton: {
    marginLeft: 12,
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#606060',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#606060',
    textAlign: 'center',
  },
});

export default SearchScreen;

