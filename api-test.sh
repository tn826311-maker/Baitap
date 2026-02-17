#!/bin/bash

# Todo List API Testing Script
# Usage: bash api-test.sh

BASE_URL="http://localhost:3000"
TOKEN=""
USER_ID=""
TASK_ID=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}========== Todo List API Tests ==========${NC}\n"

# Test 1: Register User
echo -e "${YELLOW}[1] Testing User Registration...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "username": "nguyenvana",
    "email": "nguyenvana@example.com",
    "password": "password123"
  }')

echo "Response: $REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4 | head -1)
echo -e "${GREEN}✓ Token: $TOKEN${NC}\n"

# Test 2: Login
echo -e "${YELLOW}[2] Testing User Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nguyenvana",
    "password": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"
echo -e "${GREEN}✓ Login successful${NC}\n"

# Test 3: Create Task
echo -e "${YELLOW}[3] Testing Task Creation...${NC}"
CREATE_TASK=$(curl -s -X POST "$BASE_URL/api/tasks/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Hoàn thành báo cáo",
    "description": "Báo cáo tháng 2",
    "priority": "high"
  }')

echo "Response: $CREATE_TASK"
TASK_ID=$(echo $CREATE_TASK | grep -o '"_id":"[^"]*' | cut -d'"' -f4 | head -1)
echo -e "${GREEN}✓ Task created: $TASK_ID${NC}\n"

# Test 4: Get All Tasks
echo -e "${YELLOW}[4] Testing Get All Tasks...${NC}"
ALL_TASKS=$(curl -s "$BASE_URL/api/tasks/all")
echo "Response: $ALL_TASKS"
echo -e "${GREEN}✓ All tasks retrieved${NC}\n"

# Test 5: Get Today's Tasks
echo -e "${YELLOW}[5] Testing Get Today's Tasks...${NC}"
TODAY_TASKS=$(curl -s "$BASE_URL/api/tasks/today/all")
echo "Response: $TODAY_TASKS"
echo -e "${GREEN}✓ Today's tasks retrieved${NC}\n"

# Test 6: Get Incomplete Tasks
echo -e "${YELLOW}[6] Testing Get Incomplete Tasks...${NC}"
INCOMPLETE=$(curl -s "$BASE_URL/api/tasks/incomplete/all")
echo "Response: $INCOMPLETE"
echo -e "${GREEN}✓ Incomplete tasks retrieved${NC}\n"

# Test 7: Complete Task
echo -e "${YELLOW}[7] Testing Complete Task...${NC}"
COMPLETE=$(curl -s -X PUT "$BASE_URL/api/tasks/$TASK_ID/complete" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $COMPLETE"
echo -e "${GREEN}✓ Task completed${NC}\n"

# Test 8: Delete Task
echo -e "${YELLOW}[8] Testing Delete Task...${NC}"
DELETE=$(curl -s -X DELETE "$BASE_URL/api/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $DELETE"
echo -e "${GREEN}✓ Task deleted${NC}\n"

echo -e "${GREEN}========== All Tests Completed ==========${NC}"
