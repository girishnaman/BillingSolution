package com.billing.BillingSoftware.service;

import com.billing.BillingSoftware.dto.ItemRequest;
import com.billing.BillingSoftware.dto.ItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ItemService {

    ItemResponse  add (ItemRequest itemRequest, MultipartFile file);

    List<ItemResponse> fetchItems();

    void deleteItem(String itemId);
}
