import { ElMessage } from 'element-plus'

export function showMessageBox(message = '', type = 'info') {
  ElMessage({
    message,
    type,
    showClose: true,
    duration: 3000
  })
}