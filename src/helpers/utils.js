import axios from 'axios';
import $ from 'jquery';

export const setItemToStore = (key, payload, store = localStorage) =>
  store.setItem(key, payload);

export const getItemFromStore = (key, defaultValue, store = localStorage) => {
  try {
    return store.getItem(key) === null
      ? defaultValue
      : JSON.parse(store.getItem(key));
  } catch {
    return store.getItem(key) || defaultValue;
  }
};

export const getColor = (name, dom = document.documentElement) => {
  return getComputedStyle(dom).getPropertyValue(`--falcon-${name}`).trim();
};

export const reactBootstrapDocsUrl = 'https://react-bootstrap.github.io';

export const camelize = str => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

export const capitalize = str =>
  (str.charAt(0).toUpperCase() + str.slice(1)).replace(/-/g, ' ');

export const flatRoutes = childrens => {
  const allChilds = [];

  const flatChild = childrens => {
    childrens.forEach(child => {
      if (child.children) {
        flatChild(child.children);
      } else {
        allChilds.push(child);
      }
    });
  };
  flatChild(childrens);

  return allChilds;
};

export const getFlatRoutes = children =>
  children.reduce(
    (acc, val) => {
      if (val.children) {
        return {
          ...acc,
          [camelize(val.name)]: flatRoutes(val.children)
        };
      } else {
        return {
          ...acc,
          unTitled: [...acc.unTitled, val]
        };
      }
    },
    { unTitled: [] }
  );


export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1540
};

export const isIterableArray = array => Array.isArray(array) && !!array.length;

export const getMenuTree = () => {
  let token = localStorage.getItem('Token');
  const encryptedSecurityUserId = localStorage.getItem("EncryptedSecurityUserId");
  axios.get(process.env.REACT_APP_API_URL + '/get-menu-tree/' + encryptedSecurityUserId,
    { headers: { "Authorization": `Bearer ${JSON.parse(token).value}` } }
  )
    .then(res => {
      if (res.data.status == 200) {

        var menuTreeHtml = '<li class="nav-item">';
        var parentMenus = res.data.data.filter(x => x.parentId == 0);

        for (let i = 0; i < parentMenus.length; i++) {
          const name = parentMenus[i].menuItemName;
          const childrenId = parentMenus[i].childId;
          const menuUrl = parentMenus[i].menuItemPageURL;
          const icon = parentMenus[i].menuItemIcon;

          var childMenus = res.data.data.filter(x => x.parentId == childrenId);

          menuTreeHtml += `<a id="parent_${childrenId}" data-children-container-id="children_${childrenId}" aria-current="page" class="nav-link ${childMenus.length > 0 ? 'dropdown-indicator collapsed\" aria-expanded="false' : ''}">
                                <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                  <span class="${icon ? icon : "fas fa-chart-pie"}"></span>
                                </span>
                                <span class="nav-link-text ps-1">${name}</span>
                              </div>
                          </a>`;

          if (childMenus.length > 0) {
            menuTreeHtml += `<ul id="children_${childrenId}" class="nav collapse">`;

            for (let j = 0; j < childMenus.length; j++) {
              const childId = childMenus[j].childId;
              const name = childMenus[j].menuItemName;
              const menuUrl = childMenus[j].menuItemPageURL;
              const icon = childMenus[j].menuItemIcon;

              var childChildMenus = res.data.data.filter(x => x.parentId == childId);

              menuTreeHtml += `<li id="child_${childId}" class="nav-item">
                                      <a id="parent_parent_${childId}" data-children-container-id="children_children_${childId}" aria-current="page" class="nav-link ${childChildMenus.length > 0 ? 'dropdown-indicator collapsed\" aria-expanded="false' : ''}" ${childChildMenus.length == 0 ? 'href="' + menuUrl + '"' : ''} data-parent-container-id="parent_${childrenId}">
                                        <div class="d-flex align-items-center">
                                        <span class="nav-link-icon">
                                          <span class="${icon ? icon : "fas fa-chart-pie"}"></span>
                                        </span>
                                         <span class="nav-link-text ps-1">${name}</span>
                                        </div>
                                      </a>`;

                                      if (childChildMenus.length > 0) {
                                        menuTreeHtml += `<ul id="children_children_${childId}" class="nav collapse">`;
                            
                                        for (let j = 0; j < childChildMenus.length; j++) {
                                          const childChildId = childChildMenus[j].childId;
                                          const name = childChildMenus[j].menuItemName;
                                          const menuUrl = childChildMenus[j].menuItemPageURL;
                                          const icon = childChildMenus[j].menuItemIcon;
                            
                                          menuTreeHtml += `<li id="child_child_${childChildId}" class="nav-item">
                                                                  <a class="nav-link" href="${menuUrl}" data-parent-container-id="parent_parent_${childId}" data-bs-toggle="" aria-expanded="false">
                                                                    <div class="d-flex align-items-center">
                                                                    <span class="nav-link-icon">
                                                                      <span class="${icon ? icon : "fas fa-chart-pie"}"></span>
                                                                    </span>
                                                                     <span class="nav-link-text ps-1">${name}</span>
                                                                    </div>
                                                                  </a>`;
                                        }
                            
                                        menuTreeHtml += '</ul>';
                                      }
                menuTreeHtml += '</li>';
            }

            menuTreeHtml += '</ul>';
          }
        }
        menuTreeHtml += '</li>';

        $('.navbar-vertical-content .navbar-nav .nav-item:not(:first-child)').remove();
        $('.navbar-vertical-content .navbar-nav').append(menuTreeHtml);
      }
    });
}

// validate user logged in
export const isLoggedIn = () => {
  let token = localStorage.getItem('Token');

  if (!token ||
    JSON.parse(token).expiry < new Date()) {
    localStorage.clear();
    window.location.href = '/login';
  }
  else if (JSON.parse(token).expiry < (new Date().getTime() + 7200000))  // if user is interacting with system then we are updating Token localstorage to keep it alive for one hour from current time
  {
    const config = {
      value: JSON.parse(token).value,
      expiry: new Date().getTime() + 3600000
    }
    localStorage.setItem('Token', JSON.stringify(config));
  }
}

export const handleNumericInputKeyPress  = (e) => {
  const keyCode = e.which || e.keyCode;
  const keyValue = String.fromCharCode(keyCode);

  const currentValue = e.target.value;
  const hasDecimal = currentValue.includes('.');
  // Check if the entered key is a decimal point and if there's already one in the textbox
  if (keyValue === '.' && hasDecimal) {
    e.preventDefault();
    return;
  }
  // Prevent only alphabetic characters
  // const regex = /^[^A-Za-z]+$/;

  // Allow only numbers, decimal point, and backspace
  const regex = /^[0-9.]+$/;
  if (!regex.test(keyValue)) {
    e.preventDefault();
    return;
  }
  // const [integerPart, decimalPart] = currentValue.split('.');
  // if (decimalPart && decimalPart.length >= 2) {
  //   e.preventDefault();
  //   return;
  // }
};

export const handlePercentageKeyPress = (e) => {
  const keyCode = e.which || e.keyCode;
  const keyValue = String.fromCharCode(keyCode);
  const currentValue = e.target.value;
  const regex = /^[0-9.\b]+$/;
  const value = currentValue + keyValue;
  if (!regex.test(value)) {
    e.preventDefault();
    return;
  }
  const [integerPart, decimalPart] = value.split('.');
  // Prevent more than two digits before or after the decimal point
  if (integerPart.length > 2 || (decimalPart && decimalPart.length > 2)) {
    e.preventDefault();
    return;
  }
  // Prevent more than one decimal point
  if ((keyValue === '.' && currentValue.includes('.')) || (currentValue === '.' && keyValue === '.')) {
    e.preventDefault();
    return;
  }
};