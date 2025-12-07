import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

/**
 * TodoItem 컴포넌트
 * 
 * 개별 todo 항목을 표시하는 컴포넌트입니다.
 * 
 * @param {Object} todo - todo 객체 (id, text, completed 속성 포함)
 * @param {Function} onDelete - todo를 삭제할 때 호출되는 콜백 함수
 * @param {Function} onToggle - todo의 완료 상태를 토글할 때 호출되는 콜백 함수
 */
const TodoItem = ({ todo, onDelete, onToggle }) => {
  return (
    <View style={[styles.container, todo.completed && styles.completedContainer]}>
      {/* 완료 상태를 토글하는 버튼 */}
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(todo.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkboxInner, todo.completed && styles.checkboxChecked]}>
          {todo.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      {/* Todo 텍스트 */}
      <Text
        style={[styles.text, todo.completed && styles.completedText]}
        onPress={() => onToggle(todo.id)}
      >
        {todo.text}
      </Text>

      {/* 삭제 버튼 */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(todo.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android 그림자 효과
  },
  completedContainer: {
    backgroundColor: '#f0f0f0',
    opacity: 0.7,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    flex: 1, // 남은 공간을 모두 차지
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through', // 취소선
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TodoItem;

