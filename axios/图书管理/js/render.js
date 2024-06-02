// 渲染图书列表

const creator = '老张'
function getBooksList() {
  // 获取数据
  axios({
    method: 'get',
    url: 'http://hmajax.itheima.net/api/books',
    params: {
      // 获取对应数据
      creator
    }
  }).then(result => {
    // console.log(result);
    const bookList = result.data.data
    // console.log(bookList);
    // 渲染数据
    const htmlStr = bookList.map((item, index) => {
      return `
      <tr>
      <td>${index + 1}</td>
      <td>${item.bookname}</td>
      <td>${item.author}</td>
      <td>${item.publisher}</td>
      <td data-id=${item.id}>
        <span class="del">删除</span>
        <span class="edit">编辑</span>
      </td>
    </tr>
      `
    }).join('')
    document.querySelector('.list').innerHTML = htmlStr
  })
}
getBooksList()

// 新增图书
// 1.新增弹窗-显示和隐藏
//2.收集表单数据，提交到服务器
//3.刷新图书列表
const addModalDom = document.querySelector('.add-modal')
const addModal = new bootstrap.Modal(addModalDom)
document.querySelector('.add-btn').addEventListener('click', () => {
  //收集表单数据，并提交到服务器
  const addForm = document.querySelector('.add-form')
  const bookObj = serialize(addForm, { hash: true, empty: true })
  console.log(bookObj);
  axios({
    method: 'post',
    url: 'http://hmajax.itheima.net/api/books',
    data: {
      ...bookObj,
      creator
    }
  }).then(result => {
    console.log(result);
    getBooksList()
    addForm.reset()
    addModal.hide()
  })
})

// 删除图书
// 删除元素绑定点击事件-获取图书id
// 调用删除接口
// 刷新图书列表

// 事件委托
document.querySelector('.list').addEventListener('click', e => {
  // 判断是删除按钮
  if (e.target.classList.contains('del')) {
    // 获取图书id-自定义
    const theId = e.target.parentNode.dataset.id
    // console.log(theId);
    // 调用删除接口
    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`,
      method: 'DELETE'
    }).then(() => {
      getBooksList()
    })
  }
})

// 编辑图书
// 编辑弹窗-显示和隐藏
// 获取当前编辑图书数据-回显到编辑表单中
// 提交保存修改，并刷新列表
const editDom = document.querySelector('.edit-modal')
const editModal = new bootstrap.Modal(editDom)
// 事件委托
document.querySelector('.list').addEventListener('click', e => {
  if (e.target.classList.contains('edit')) {
    // 获取当前编辑图书数据-回显到编辑表单中
    const theId = e.target.parentNode.dataset.id
    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`,
    }).then(result => {
      const bookObj = result.data.data
      // 数据对象属性和标签类名一致
      // 遍历数组对象，使用属性区获取对应的标签，快速赋值
      const keys = Object.keys(bookObj)
      keys.forEach(key => {
        document.querySelector(`.edit-form .${key}`).value = bookObj[key]
      })
    })
    editModal.show()
  }
})
document.querySelector('.edit-btn').addEventListener('click', () => {
  const editForm = document.querySelector('.edit-form')
  // 解构
  const { id, bookname, author, publisher } = serialize(editForm, { hash: true, empty: true })
  // 保存正在编辑的图书id，隐藏起来，无需让用户修改
  // <input type="hidden" class="id" name="id">
  axios({
    url: `http://hmajax.itheima.net/api/books/${id}`,
    method: 'PUT',
    data: {
      bookname,
      author,
      publisher,
      creator
    }
  }).then(() => {
    getBooksList()
    editModal.hide()
  })

})
