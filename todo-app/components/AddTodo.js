import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';

/**
 * AddTodo 컴포넌트
 * 
 * 새로운 todo를 추가하는 입력 폼 컴포넌트입니다.
 * 
 * @param {Function} onAdd - todo를 추가할 때 호출되는 콜백 함수
 */
const AddTodo = ({ onAdd }) => {
  // 입력 필드의 텍스트를 관리하는 상태
  const [text, setText] = useState('');

  /**
   * 추가 버튼을 눌렀을 때 실행되는 함수
   */
  const handleAdd = () => {
    // 입력값이 비어있으면 경고 메시지 표시
    if (text.trim() === '') {
      Alert.alert('알림', '할 일을 입력해주세요!');
      return;
    }

    // 부모 컴포넌트(App)의 onAdd 함수 호출하여 todo 추가
    onAdd(text.trim());
    
    // 입력 필드 초기화
    setText('');
  };

  return (
    <View style={styles.container}>
      {/* 텍스트 입력 필드 */}
      <TextInput
        style={styles.input}
        placeholder="할 일을 입력하세요..."
        placeholderTextColor="#999"
        value={text}
        onChangeText={setText} // 텍스트가 변경될 때마다 상태 업데이트
        onSubmitEditing={handleAdd} // 엔터 키를 눌렀을 때도 추가
      />
      
      {/* 추가 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleAdd}
        activeOpacity={0.7} // 버튼을 눌렀을 때 투명도 효과
      >
        <Text style={styles.buttonText}>추가</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // 가로 방향으로 배치
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    flex: 1, // 남은 공간을 모두 차지
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginRight: 10,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddTodo;

