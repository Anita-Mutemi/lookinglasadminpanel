/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Input,
  Switch,
  Checkbox,
  List,
  Divider,
  Popconfirm,
  Row,
  Col,
  Typography
} from 'antd';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PlusOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import httpService from '../../services/http.service';

const { Title } = Typography;


const makeHttpRequestConfig = (access_token) => {
  return {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
  };
};


const makeCollectionUpdate = (updateItems) => {
  return {
    patch_items: updateItems.map((item) => ({
      id: item._id,
      enabled: item.value,
      value: item.title,
    })),
  };
};

const makeCollectionDelete = (deleteItems) => {
  return {
    delete_items: deleteItems.map((item) => item._id),
  };
};

const httpUtils = {
  fetchCollections: async (name, access_token) => {
    const { data } = await httpService.get(`/v1/collections/${name}`, makeHttpRequestConfig(access_token));
    return data.items.map((item) => ({
      ...item,
      title: item.value,
      value: item.enabled,
    }));
  },
  createItemOnServer: async (name, value, access_token) => {
    try {
      let payload = { value, enabled: true };
      console.log(payload);
      let newItem = (
        await httpService.put(`/v1/collections/${name}/items`, payload, makeHttpRequestConfig(access_token))
      ).data;
      toast.success('Collection item updated successfully.');
      return newItem;
    } catch (err) {
      let detail =
        err && err.response && err.response.data && err.response.data.detail
          ? ` (Reason: ${err.response.data.detail})`
          : '';
      toast.error('Failed to create collection item' + detail);
    }
  },
  updateItemOnServer: async (name, item, access_token) => {
    try {
      let patch = makeCollectionUpdate([item]);
      await httpService.patch(`/v1/collections/${name}`, patch, makeHttpRequestConfig(access_token));
      toast.success('Collection item updated successfully.');
    } catch (err) {
      toast.error('Failed to update collection item.');
    }
  },
  deleteItemsOnServer: async (name, item, access_token) => {
    try {
      let patch = makeCollectionDelete([item]);
      await httpService.patch(`/v1/collections/${name}`, patch, makeHttpRequestConfig(access_token));
      toast.success('Collection item deleted successfully.');
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete collection item.');
    }
  },
};

function CollectionItem({ item, onToggle, onDelete, onSelect, view, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);

  const handleEdit = () => {
    onEdit(item, editedTitle);
    setIsEditing(false);
  };

  return view === 'grid' ? (
    <Col span={4} style={{ padding: '1rem' }}>
      <Card
        size='small'
        title={
          isEditing ? (
            <>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <Button type='link' onClick={handleEdit}>
                Save
              </Button>
            </>
          ) : (
            item.title
          )
        }
      >
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isEditing ? (
            <>
              <Button type='link' onClick={handleEdit}>
                Save
              </Button>
            </>
          ) : (
            <Button type='link' onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
          <Switch checked={item.value} onChange={() => onToggle(item)} />
          <Checkbox onChange={(e) => onSelect(item, e.target.checked)} />
          <Popconfirm
            title='Are you sure delete this item?'
            onConfirm={() => onDelete(item)}
            okText='Yes'
            cancelText='No'
          >
            <Button type='link'>Delete</Button>
          </Popconfirm>
        </div>
      </Card>
    </Col>
  ) : (
    <List.Item
      actions={[
        <Switch checked={item.value} onChange={() => onToggle(item)} key={item.value} />,
        <Checkbox onChange={(e) => onSelect(item, e.target.checked)} key={item.value} />,
        <>
          {isEditing ? (
            <>
              <Button type='link' onClick={handleEdit}>
                Save
              </Button>
            </>
          ) : (
            <Button type='link' onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
          <Popconfirm
            title='Are you sure delete this item?'
            onConfirm={() => onDelete(item)}
            okText='Yes'
            cancelText='No'
          >
            <Button type='link'>Delete</Button>
          </Popconfirm>
        </>,
      ]}
      style={{ background: 'white' }}
    >
      {isEditing ? (
        <>
          <Input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
        </>
      ) : (
        item.title
      )}
    </List.Item>
  );
}

function AddItemInput({ onAdd, value, setValue }) {
  const handleAdd = () => {
    if (onAdd) {
      onAdd(value);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Add a new item'
        onPressEnter={handleAdd}
        style={{ flex: 1, marginRight: '10px' }}
      />
      <Button icon={<PlusOutlined />} onClick={handleAdd} type='primary'>
        Add
      </Button>
    </div>
  );
}

function ActionsPanel({ onToggleAll, onToggleSelected, view, setView }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <Button onClick={() => onToggleAll(true)} style={{ marginRight: '10px' }}>
        Toggle All On
      </Button>
      <Button onClick={() => onToggleAll(false)} style={{ marginRight: '10px' }}>
        Toggle All Off
      </Button>
      <Button onClick={() => onToggleSelected(true)} style={{ marginRight: '10px' }}>
        Toggle Selected On
      </Button>
      <Button onClick={() => onToggleSelected(false)} style={{ marginRight: '10px' }}>
        Toggle Selected Off
      </Button>
      <Button
        icon={view === 'list' ? <AppstoreOutlined /> : <BarsOutlined />}
        onClick={() => setView(view === 'list' ? 'grid' : 'list')}
      >
        Switch View
      </Button>
    </div>
  );
}

function CollectionsList({ items, view, onToggle, onDelete, onSelect, onEdit }) {
  return view === 'list' ? (
    <List
      bordered
      dataSource={items}
      renderItem={(item) => (
        <CollectionItem
          item={item}
          onToggle={onToggle}
          onDelete={onDelete}
          onSelect={onSelect}
          onEdit={onEdit}
          view={view}
        />
      )}
    />
  ) : (
    <Row gutter={16}>
      {items.map((item) => (
        <CollectionItem
          key={item.title}
          item={item}
          onToggle={onToggle}
          onDelete={onDelete}
          onSelect={onSelect}
          onEdit={onEdit}
          view={view}
        />
      ))}
    </Row>
  );
}
function Collection({ name }) {
  const [items, setItems] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [selected, setSelected] = useState([]);
  const [view, setView] = useState('list');

  const { access_token } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedItems = await httpUtils.fetchCollections(name, access_token);
        setItems(fetchedItems);
      } catch (err) {
        console.log(err);
        toast.error('Failed to fetch collections.');
      }
    };
    fetchData();
  }, [access_token]);

  const updateItems = (updateFn) => {
    const updatedItems = items.map(updateFn);
    setItems(updatedItems);
  };

  const handleAdd = async () => {
    let newItem = await httpUtils.createItemOnServer(name, newTitle, access_token);
    if (newItem) {
      setItems((prev) => [
        ...prev,
        { ...newItem, title: newItem.value, value: newItem.enabled },
      ]);
      setNewTitle('');
    }
  };

  const handleToggle = (item) => {
    const updatedItem = { ...item, value: !item.value };
    httpUtils.updateItemOnServer(name, updatedItem, access_token);
    updateItems((i) => (i.title === item.title ? updatedItem : i));
  };

  const handleEdit = (item, newTitle) => {
    const updatedItem = { ...item, title: newTitle };
    httpUtils.updateItemOnServer(name, updatedItem, access_token);
    updateItems((i) => (i._id === item._id ? updatedItem : i));
  };

  const handleDelete = (item) => {
    httpUtils.deleteItemsOnServer(name, item, access_token);
    setItems(items.filter((i) => i._id !== item._id));
  };

  const handleSelect = (item, checked) => {
    setSelected((prev) =>
      checked ? [...prev, item.title] : prev.filter((title) => title !== item.title),
    );
  };

  const toggleAll = (value) => {
    items.forEach((item) => handleToggle(item));
    updateItems((i) => ({ ...i, value }));
  };

  const toggleSelected = (value) => {
    selected.forEach((item) => handleToggle(item));
    updateItems((i) => (selected.includes(i.title) ? { ...i, value } : i));
  };

  return (
    <div>
      <AddItemInput onAdd={handleAdd} value={newTitle} setValue={setNewTitle} />
      <Divider />
      <ActionsPanel
        onToggleAll={(status) => toggleAll(status)}
        onToggleSelected={(status) => toggleSelected(status)}
        view={view}
        setView={setView}
      />

      <Title level={3}>{name}</Title>

      <AddItemInput onAdd={handleAdd} value={newTitle} setValue={setNewTitle} />
      <CollectionsList
        items={items}
        view={view}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onSelect={handleSelect}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default Collection;
