import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AddTodo from './components/AddTodo';
import TodoItem from './components/TodoItem';

/**
 * 메인 App 컴포넌트
 * 
 * 이 컴포넌트는 Todo 앱의 최상위 컴포넌트입니다.
 * useState를 사용하여 todo 리스트의 상태를 관리합니다.
 */
export default function App() {
  // useState Hook: 컴포넌트의 상태를 관리하는 React Hook
  // todos: 현재 todo 항목들의 배열
  // setTodos: todos 상태를 업데이트하는 함수
  const [todos, setTodos] = useState([]);

  /**
   * 새로운 todo를 추가하는 함수
   * @param {string} text - 추가할 todo의 텍스트
   */
  const addTodo = (text) => {
    // 새로운 todo 객체 생성
    const newTodo = {
      id: Date.now().toString(), // 고유 ID 생성 (현재 시간 사용)
      text: text,
      completed: false, // 초기값은 미완료 상태
    };
    
    // 기존 todos 배열에 새로운 todo 추가
    // ...todos는 기존 배열의 모든 항목을 펼쳐서 복사 (spread operator)
    setTodos([...todos, newTodo]);
  };

  /**
   * todo를 삭제하는 함수
   * @param {string} id - 삭제할 todo의 ID
   */
  const deleteTodo = (id) => {
    // filter 함수를 사용하여 해당 id를 가진 todo를 제외한 새 배열 생성
    setTodos(todos.filter(todo => todo.id !== id));
  };

  /**
   * todo의 완료 상태를 토글하는 함수
   * @param {string} id - 토글할 todo의 ID
   */
  const toggleTodo = (id) => {
    // map 함수를 사용하여 해당 id의 todo만 completed 상태를 반대로 변경
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* 앱 제목 */}
      <View style={styles.header}>
        <Text style={styles.title}>📝 Todo 앱</Text>
        <Text style={styles.subtitle}>초보자를 위한 가이드</Text>
      </View>

      {/* 새로운 todo를 추가하는 컴포넌트 */}
      <AddTodo onAdd={addTodo} />

      {/* Todo 리스트를 표시하는 영역 */}
      <ScrollView style={styles.todoList}>
        {todos.length === 0 ? (
          // todo가 없을 때 표시할 메시지
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              아직 할 일이 없습니다.{'\n'}
              위에서 새로운 할 일을 추가해보세요!
            </Text>
          </View>
        ) : (
          // todos 배열을 map으로 순회하며 각 TodoItem 컴포넌트 렌더링
          todos.map(todo => (
            <TodoItem
              key={todo.id} // React에서 리스트를 렌더링할 때 필요한 고유 key
              todo={todo}
              onDelete={deleteTodo}
              onToggle={toggleTodo}
            />
          ))
        )}
      </ScrollView>

      {/* 통계 정보 */}
      <View style={styles.footer}>
        <Text style={styles.stats}>
          전체: {todos.length}개 | 
          완료: {todos.filter(t => t.completed).length}개 | 
          남은 일: {todos.filter(t => !t.completed).length}개
        </Text>
      </View>
    </SafeAreaView>
  );
}

// StyleSheet: React Native에서 스타일을 정의하는 방법
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#E8F4F8',
  },
  todoList: {
    flex: 1,
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  stats: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

